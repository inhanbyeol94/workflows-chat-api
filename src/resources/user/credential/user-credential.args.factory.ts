import { Prisma } from '../../../core/database/generated/prisma';
import { UserCredentialFindFirstArgs, UserCredentialUpdateArgs } from '../../../core/database/generated/prisma/models/UserCredential';

export class UserCredentialArgsFactory {
    static findByLoginIdWithUserOrThrow(loginId: string) {
        return Prisma.validator<UserCredentialFindFirstArgs>()({
            where: { loginId, deletedAt: null },
            include: {
                user: true,
            },
        });
    }

    static checkLoginIdDuplicate(loginId: string) {
        return Prisma.validator<UserCredentialFindFirstArgs>()({
            where: { loginId, deletedAt: null },
        });
    }

    static findByIdOrThrow(id: number) {
        return Prisma.validator<UserCredentialFindFirstArgs>()({
            where: { id, deletedAt: null },
        });
    }

    static changePassword(id: number, password: string, pepper: string) {
        return Prisma.validator<UserCredentialUpdateArgs>()({
            where: { id, deletedAt: null },
            data: {
                password,
                pepper,
            },
        });
    }
}
