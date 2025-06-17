import { Injectable } from '@nestjs/common';
import { Database } from '../../core/database/database';
import { CommonRepository } from '../../common/common.repository';
import { UserDelegate } from '../../core/database/generated/prisma/models/User';

@Injectable()
export class UserRepository extends CommonRepository<UserDelegate> {
    constructor(private prisma: Database) {
        super(prisma.user);
    }
}
