import { Injectable } from '@nestjs/common';
import { CommonRepository } from '../../common/common.repository';
import { Database } from '../../core/database/database';
import { ChannelDelegate } from '../../core/database/generated/prisma/models/Channel';

@Injectable()
export class ChannelRepository extends CommonRepository<ChannelDelegate> {
    constructor(private prisma: Database) {
        super(prisma.channel);
    }
}
