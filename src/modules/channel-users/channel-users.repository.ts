import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@modules/base/base.repository';
import { ChannelUsersDelegate } from '@database/prisma/models/ChannelUsers';
import { Database } from '@modules/database/database';

@Injectable()
export class ChannelUsersRepository extends BaseRepository<ChannelUsersDelegate> {
    constructor(private prisma: Database) {
        super(prisma.channelUsers);
    }
}
