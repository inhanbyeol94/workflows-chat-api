import { UserRegisterDto } from './dto/user-register.dto';
import { UserCreateArgs, UserFindUniqueArgs, UserUpdateArgs } from '../../core/database/generated/prisma/models/User';
import { UserModifyDto } from './dto/user-modify.dto';
import { Prisma } from '../../core/database/generated/prisma/client';

export class UserArgsFactory {
    static register(data: UserRegisterDto, pepper: string, hash: string) {
        const { loginId, password, ...fields } = data;
        return Prisma.validator<UserCreateArgs>()({
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
    static modify(id: number, data: UserModifyDto, pepper?: string, hash?: string) {
        const { loginId, password, ...fields } = data;
        return Prisma.validator<UserUpdateArgs>()({
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
    static unregister(id: number) {
        return Prisma.validator<UserUpdateArgs>()({
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
    static findByIdOrThrow(id: number) {
        return Prisma.validator<UserFindUniqueArgs>()({
            where: {
                id,
                deletedAt: null,
            },
        });
    }
}
