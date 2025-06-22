import { ChannelCreateDto } from './dto/channel-create.dto';
import {
    ChannelCreateArgs,
    ChannelFindFirstArgs,
    ChannelFindManyArgs,
    ChannelFindUniqueArgs,
    ChannelUpdateArgs,
} from '../../core/database/generated/prisma/models/Channel';
import { ChannelModifyDto } from './dto/channel-modify.dto';
import { Prisma } from '../../core/database/generated/prisma/client';

export class ChannelArgsFactory {
    static create(data: ChannelCreateDto, creatorId: number, userIds?: number[]) {
        return Prisma.validator<ChannelCreateArgs>()({
            data: {
                ...data,
                creatorId,
                users: {
                    create: userIds?.map((userId) => ({ userId })) || [],
                },
            },
        });
    }

    static modify(id: number, data: ChannelModifyDto) {
        return Prisma.validator<ChannelUpdateArgs>()({
            where: {
                id,
                deletedAt: null,
            },
            data,
        });
    }

    static delete(id: number) {
        return Prisma.validator<ChannelUpdateArgs>()({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    static findByIdOrThrow(id: number) {
        return Prisma.validator<ChannelFindUniqueArgs>()({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    static checkNameDuplicate(name: string) {
        return Prisma.validator<ChannelFindFirstArgs>()({
            where: {
                name,
                deletedAt: null,
            },
        });
    }

    static findManyByUserId(userId: number) {
        return Prisma.validator<ChannelFindManyArgs>()({
            where: {
                deletedAt: null,
                users: {
                    some: { userId },
                },
            },
        });
    }
}
