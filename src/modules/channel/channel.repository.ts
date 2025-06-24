import { Injectable } from '@nestjs/common';
import { Database } from '@modules/database/database';
import { BaseRepository } from '@modules/base/base.repository';
import { ChannelDelegate } from '@database/prisma/models/Channel';

@Injectable()
export class ChannelRepository extends BaseRepository<ChannelDelegate> {
    constructor(private prisma: Database) {
        super(prisma.channel);
    }
}
