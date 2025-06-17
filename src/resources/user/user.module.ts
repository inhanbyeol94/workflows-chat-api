import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { UserService } from './user.service';
import { PasswordModule } from '../../core/password/password.module';
import { UserCredentialModule } from './credential/user-credential.module';
import { UserRepository } from './user.repository';

@Module({
    imports: [DatabaseModule, PasswordModule, forwardRef(() => UserCredentialModule)],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
