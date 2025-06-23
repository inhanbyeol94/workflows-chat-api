import { forwardRef, Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { DatabaseModule } from '../database/database.module';
import { PasswordModule } from '../password/password.module';
import { UserModule } from '../user/user.module';
import { UserCredentialRepository } from './user-credential.repository';

@Module({
    imports: [DatabaseModule, PasswordModule, forwardRef(() => UserModule)],
    providers: [UserCredentialService, UserCredentialRepository],
    exports: [UserCredentialService],
})
export class UserCredentialModule {}
