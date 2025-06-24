import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { PasswordModule } from '../password/password.module';
import { UserRepository } from './user.repository';
import { UserCredentialRepository } from '@modules/user/user-credential.repository';

@Module({
    imports: [DatabaseModule, PasswordModule],
    providers: [UserService, UserRepository, UserCredentialRepository],
    exports: [UserService],
})
export class UserModule {}
