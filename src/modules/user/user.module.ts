import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { PasswordModule } from '../password/password.module';

@Module({
    imports: [DatabaseModule, PasswordModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
