import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { ChannelCreateDto } from '@modules/channel/dto/channel-create.dto';
import { ChannelModifyDto } from '@modules/channel/dto/channel-modify.dto';
import { ChannelRepository } from '@modules/channel/channel.repository';
import { AuthPayload } from '@modules/auth/auth.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChannelService {
    constructor(
        private repository: ChannelRepository,
        private userService: UserService,
        private eventEmitter: EventEmitter2,
    ) {}

    /**
     * ### 생성
     * @desc 채널을 생성하는 행위입니다. 단, name이 중복되면 예외가 발생합니다.
     * @desc 채널 생성 후 모든 사용자에게 동기화 이벤트를 요청합니다.
     * */
    async create(data: ChannelCreateDto, user: AuthPayload) {
        await this.checkNameDuplicate(data.name);

        let userIds: number[] = [];

        if (!data.isSecret) {
            // 비밀 채널이 아닌 경우, 모든 사용자에게 채널을 추가합니다.
            const users = await this.userService.findManyIds();
            userIds = users.map((u) => u.id);
        } else {
            userIds = [user.id];
        }

        return this.repository.create({
            data: {
                ...data,
                creatorId: user.id,
                users: {
                    create: userIds?.map((userId) => ({ userId })) || [],
                },
            },
        });
    }

    /**
     * ### 수정
     * @desc 채널수정 행위입니다.
     * @throws NotFoundException 만약 채널이 존재하지 않으면 예외가 발생합니다.
     * @throws ForbiddenException 관리자가 아니거나, 채널 생성자가 아닌 경우 예외가 발생합니다.
     * @throws ConflictException 만약 채널명이 중복되면 예외가 발생합니다.
     * */
    async modify(id: number, data: ChannelModifyDto, user: AuthPayload) {
        const resource = await this.findByIdOrThrow(id);
        if (resource.creatorId !== user.id && user.role !== 99) throw new ForbiddenException('채널을 수정할 권한이 없습니다.');
        await this.checkNameDuplicate(data.name, id);

        const modify = await this.repository.update({
            where: {
                id,
                deletedAt: null,
            },
            data,
        });
        this.eventEmitter.emit('channel.update', modify);
        return modify;
    }

    /**
     * ### 삭제
     * @desc 채널을 논리삭제합니다.
     * @throws NotFoundException 만약 채널이 존재하지 않으면 예외가 발생합니다.
     * @throws ForbiddenException 관리자가 아니거나, 채널 생성자가 아닌 경우 예외가 발생합니다.
     * */
    async delete(id: number, user: AuthPayload) {
        const resource = await this.findByIdOrThrow(id);
        if (resource.creatorId !== user.id && user.role !== 99) throw new ForbiddenException('채널을 삭제할 권한이 없습니다.');
        const action = await this.repository.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
        this.eventEmitter.emit('channel.delete', action);
        return action;
    }

    /**
     * ### 채널명 중복 검사
     * @desc 채널명을 통해 중복 여부를 검사합니다.
     * @throws ConflictException 만약 채널명이 중복되면 예외가 발생합니다.
     * */
    private async checkNameDuplicate(name: string, id?: number) {
        const resource = await this.repository.findFirst({
            where: {
                name,
                deletedAt: null,
            },
        });
        if (resource && (!id || resource.id !== id)) throw new ConflictException('이미 사용중인 채널명입니다.');
    }

    /**
     * ### 단일 조회
     * @desc id를 통해 단일 채널을 조회합니다.
     * @throws NotFoundException 만약 채널이 존재하지 않으면 예외가 발생합니다.
     * */
    async findByIdOrThrow(id: number) {
        const resource = await this.repository.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!resource) throw new NotFoundException('채널이 존재하지 않습니다.');
        return resource;
    }

    /**
     * ### 사용자 ID로 채널 목록 조회
     * @desc 사용자가 참여중이거나, 비밀 채널이 아닌 채널 목록을 조회합니다.
     * */
    async findManyByUserId(userId: number) {
        return this.repository.findMany({
            where: {
                deletedAt: null,
                users: {
                    some: { userId },
                },
            },
        });
    }

    /**
     * ### 공개방 목록조회
     * @desc 공개방 목록을 조회합니다.
     * */
    async findManyByPublic() {
        return this.repository.findMany({
            where: {
                deletedAt: null,
                isSecret: false,
            },
        });
    }
}
