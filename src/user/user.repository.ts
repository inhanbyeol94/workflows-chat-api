import { Injectable } from '@nestjs/common';
import { Database } from '../database/database';
import { CommonRepository } from '../_common/common.repository';
import { UserDelegate } from '../database/generated/prisma/models/User';

@Injectable()
export class UserRepository extends CommonRepository<UserDelegate> {
    constructor(private prisma: Database) {
        super(prisma.user);
    }
}
