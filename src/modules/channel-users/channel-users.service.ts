import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { Database } from '@modules/database/database';
import { ChannelUsersDelegate } from '@database/prisma/models/ChannelUsers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChannelUsers } from '@database/prisma/client';
import { ChannelService } from '@modules/channel/channel.service';
import { AuthPayload } from '@modules/auth/auth.type';
import { ROLE } from '@modules/user/user.role';

@Injectable()
export class ChannelUsersService {
    private repository: ChannelUsersDelegate;

    constructor(
        private prisma: Database,
        private eventEmitter: EventEmitter2,
        private channelService: ChannelService,
    ) {
        this.repository = prisma.channelUsers;
    }

    async invite(channelId: number, userIds: number[], user: AuthPayload) {
        const channel = await this.channelService.findByIdOrThrow(channelId);
        if (channel.creatorId !== user.id && user.role !== ROLE.MASTER) throw new ForbiddenException('초대 권한이 없습니다.');

        const resources: ChannelUsers[] = [];

        for (const userId of userIds) {
            const resource = await this.create(userId, channelId);
            resources.push(resource);
        }

        return resources;
    }

    async create(userId: number, channelId: number) {
        // 예외가 발생되지 않도록 이미 참여된 채널인 경우 종결
        const resource = await this.repository.findUnique({ where: { channelId_userId: { channelId, userId } } });
        if (resource) return resource;

        const create = await this.repository.create({
            data: {
                userId,
                channelId,
            },
            include: { user: true },
        });
        this.eventEmitter.emit('channel.join-message', { channelId, user: create.user });
        return create;
    }
}
