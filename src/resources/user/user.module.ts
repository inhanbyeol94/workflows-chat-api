import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { UserService } from './user.service';
import { PasswordModule } from '../../core/password/password.module';
import { UserCredentialModule } from '../user-credential/user-credential.module';

@Module({
    imports: [DatabaseModule, PasswordModule, forwardRef(() => UserCredentialModule)],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
