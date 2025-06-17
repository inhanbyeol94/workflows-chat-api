import { forwardRef, Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { DatabaseModule } from '../../../core/database/database.module';
import { PasswordModule } from '../../../core/password/password.module';
import { UserModule } from '../user.module';
import { UserCredentialRepository } from './user-credential.repository';

@Module({
    imports: [DatabaseModule, PasswordModule, forwardRef(() => UserModule)],
    providers: [UserCredentialService, UserCredentialRepository],
    exports: [UserCredentialService],
})
export class UserCredentialModule {}
