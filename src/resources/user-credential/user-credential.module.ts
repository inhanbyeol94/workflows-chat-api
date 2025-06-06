import { forwardRef, Module } from '@nestjs/common';
import { UserCredentialService } from './user-credential.service';
import { DatabaseModule } from '../../core/database/database.module';
import { PasswordModule } from '../../core/password/password.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [DatabaseModule, PasswordModule, forwardRef(() => UserModule)],
    providers: [UserCredentialService],
    exports: [UserCredentialService],
})
export class UserCredentialModule {}
