import { Injectable } from '@nestjs/common';
import { CommonRepository } from '../_common/common.repository';
import { Database } from '../database/database';
import { ChannelDelegate } from '../database/generated/prisma/models/Channel';

@Injectable()
export class ChannelRepository extends CommonRepository<ChannelDelegate> {
    constructor(private prisma: Database) {
        super(prisma.channel);
    }
}
