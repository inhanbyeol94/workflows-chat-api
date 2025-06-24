import { Injectable } from '@nestjs/common';
import { Database } from '@modules/database/database';
import { BaseRepository } from '@modules/base/base.repository';
import { UserDelegate } from '@database/prisma/models/User';

@Injectable()
export class UserRepository extends BaseRepository<UserDelegate> {
    constructor(private prisma: Database) {
        super(prisma.user);
    }
}
