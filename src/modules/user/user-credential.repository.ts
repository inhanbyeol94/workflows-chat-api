import { Injectable } from '@nestjs/common';
import { Database } from '@modules/database/database';
import { BaseRepository } from '@modules/base/base.repository';
import { UserCredentialDelegate } from '@database/prisma/models/UserCredential';

@Injectable()
export class UserCredentialRepository extends BaseRepository<UserCredentialDelegate> {
    constructor(private prisma: Database) {
        super(prisma.userCredential);
    }
}
