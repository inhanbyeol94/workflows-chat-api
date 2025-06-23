import { Injectable } from '@nestjs/common';
import { CommonRepository } from '../_common/common.repository';
import { UserCredentialDelegate } from '../database/generated/prisma/models/UserCredential';
import { Database } from '../database/database';

@Injectable()
export class UserCredentialRepository extends CommonRepository<UserCredentialDelegate> {
    constructor(private prisma: Database) {
        super(prisma.userCredential);
    }
}
