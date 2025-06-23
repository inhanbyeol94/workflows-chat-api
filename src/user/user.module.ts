import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { PasswordModule } from '../password/password.module';
import { UserCredentialModule } from '../user-credential/user-credential.module';
import { UserRepository } from './user.repository';

@Module({
    imports: [DatabaseModule, PasswordModule, forwardRef(() => UserCredentialModule)],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
