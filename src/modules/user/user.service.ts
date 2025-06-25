import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserModifyDto } from './dto/user-modify.dto';
import { PasswordService } from '@modules/password/password.service';
import { Database } from '@modules/database/database';
import { UserDelegate, UserFindManyArgs } from '@database/prisma/models/User';
import { UserCredentialDelegate } from '@database/prisma/models/UserCredential';
import { Prisma } from '@database/prisma/client';
import { Pagination } from '@common/types/pagination.type';

@Injectable()
export class UserService {
    private repository: UserDelegate;
    private credentialRepository: UserCredentialDelegate;
    constructor(
        private passwordService: PasswordService,
        private prisma: Database,
    ) {
        this.repository = this.prisma.user;
        this.credentialRepository = this.prisma.userCredential;
    }

    /**
     * ### 등록
     * @role 관리
     * @desc 사용자 등록 시, 로그인 아이디 중복 체크를 수행하며, 비밀번호는 암호회된 후 저장됩니다.
     * @throws ConflictException 로그인 아이디가 중복된 경우
     * */
    async register(data: UserRegisterDto) {
        await this.checkLoginIdDuplicate(data.loginId);

        const pepper = this.passwordService.getPepper();
        const hash = await this.passwordService.hash(data.password, pepper);

        const { loginId, password, ...fields } = data;

        return this.repository.create({
            data: {
                ...fields,
                credential: {
                    create: {
                        loginId,
                        password: hash,
                        pepper,
                    },
                },
            },
        });
    }

    /**
     * ### 수정
     * @role 관리
     * @desc 민감한 정보를 포함한 사용자 정보를 수정합니다.
     * */
    async modify(id: number, data: UserModifyDto) {
        // 유효성 검증
        await this.findByIdOrThrow(id);

        let pepper: string | undefined;
        let hash: string | undefined;

        if (data.password) {
            // 패스워드 암호화 및 페퍼 업데이트
            pepper = this.passwordService.getPepper();
            hash = await this.passwordService.hash(data.password, pepper);
        }

        if (data.loginId) {
            // 로그인 아이디 중복 체크
            await this.checkLoginIdDuplicate(data.loginId, id);
        }

        const { loginId, password, ...fields } = data;
        return this.repository.update({
            where: {
                id,
                deletedAt: null,
            },
            data: {
                ...fields,
                credential: {
                    update: {
                        loginId,
                        password: hash ?? undefined,
                        pepper: pepper ?? undefined,
                    },
                },
            },
        });
    }

    /**
     * ### 탈퇴
     * @role 관리
     * @desc 민감 정보를 포함하여 사용자 정보를 논리삭제합니다. (deletedAt 필드에 현재 시간을 저장)
     * */
    async unregister(id: number) {
        await this.findByIdOrThrow(id);
        return this.repository.update({
            where: {
                id,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                credential: {
                    update: {
                        deletedAt: new Date(),
                    },
                },
            },
        });
    }

    /**
     * ### 단일 조회
     * @role 공통
     * @desc 민감한 정보를 제외한 사용자 정보를 조회합니다.
     * @throws NotFoundException id로 조회된 리소스가 없을 경우
     * */
    async findByIdOrThrow(id: number) {
        const resource = await this.repository.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!resource) throw new NotFoundException();
        return resource;
    }

    async findList(data: Pagination & { channelId?: number; name?: string }) {
        const args = Prisma.validator<UserFindManyArgs>()({
            where: {
                channels: {
                    some: {
                        channelId: data.channelId,
                    },
                },
                name: {
                    contains: data.name,
                    mode: 'insensitive',
                },
                deletedAt: null,
            },
            take: data.take,
            skip: (data.page - 1) * data.take,
            orderBy: {
                name: 'asc',
            },
        });

        return this.prisma.$transaction([this.repository.findMany(args), this.repository.count({ where: args.where })]);
    }

    /**
     * ### 사용자 전체 조회 (아이디만 반환)
     * */
    async findManyIds() {
        return this.repository.findMany({ where: { deletedAt: null }, select: { id: true } });
    }

    /**
     * ### 로그인 아이디로 조회
     * @desc 로그인 아이디 조회 시 deletedAt이 null인 사용자만 조회합니다.
     * @role 공통
     * @include user
     * @throws NotFoundException 아이디가 존재하지 않는 경우
     * */
    async credentialFindByLoginIdWithUserOrThrow(loginId: string) {
        const resource = await this.credentialRepository.findFirst({
            where: { loginId, deletedAt: null },
            include: {
                user: true,
            },
        });
        if (!resource) throw new NotFoundException('아이디를 찾을 수 없습니다.');
        return resource;
    }

    /**
     * ### 로그인 아이디 중복 검사
     * @desc 로그인 아이디 중복 검사 시 deletedAt이 null인 사용자만 조회하며, id가 제공된 경우 해당 id와 비교하여 중복 여부를 검사합니다.
     * @role 공통
     * @throws ConflictException 이미 사용중인 아이디인 경우
     * */
    async checkLoginIdDuplicate(loginId: string, id?: number | null) {
        const resource = await this.credentialRepository.findFirst({
            where: { loginId, deletedAt: null },
        });
        if (resource && (!id || resource.id !== id)) {
            throw new ConflictException('이미 사용중인 아이디입니다.');
        }
    }

    /**
     * ### 단일 조회
     * @desc id로 단일 조회 시 deletedAt이 null인 사용자만 조회합니다.
     * @role 공통
     * @throws NotFoundException 조회 결과가 존재하지 않는 경우
     * */
    async credentialFindByIdOrThrow(id: number) {
        const resource = await this.credentialRepository.findUnique({
            where: { id, deletedAt: null },
        });
        if (!resource) throw new NotFoundException('사용자를 찾을 수 없습니다.');
        return resource;
    }

    /**
     * ### 패스워드 변경
     * @desc 사용자의 패스워드를 변경할 수 있으며, 기존 패스워드일치 시 새 패스워드로 변경합니다.
     * @desc 단, 기존 패스워드가 들어오지 않는 경우 기존 패스워드 검증을 건너뛰며, 패스워드 변경 시 새로운 페퍼를 생성하여 저장합니다.
     * @role 공통
     * @throws NotFoundException 변경 대상이 존재하지 않는 경우
     * @throws ConflictException 기존 패스워드가 일치하지 않는 경우
     * */
    async changePassword(id: number, { oldPassword, newPassword }: { oldPassword?: string; newPassword: string }) {
        const resource = await this.credentialFindByIdOrThrow(id);

        if (oldPassword) {
            const compare = await this.passwordService.compare(oldPassword, resource.pepper, resource.password);
            if (!compare) throw new ConflictException('기존 비밀번호가 일치하지 않습니다.');
        }
        const pepper = this.passwordService.getPepper();
        const hash = await this.passwordService.hash(newPassword, pepper);

        return this.credentialRepository.update({
            where: { id, deletedAt: null },
            data: {
                password: hash,
                pepper,
            },
        });
    }
}
