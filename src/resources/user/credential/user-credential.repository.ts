import { Injectable } from '@nestjs/common';
import { CommonRepository } from '../../../common/common.repository';
import { UserCredentialDelegate } from '../../../core/database/generated/prisma/models/UserCredential';
import { Database } from '../../../core/database/database';

@Injectable()
export class UserCredentialRepository extends CommonRepository<UserCredentialDelegate> {
    constructor(private prisma: Database) {
        super(prisma.userCredential);
    }
}
