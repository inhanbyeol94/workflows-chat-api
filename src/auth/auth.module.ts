import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PasswordModule } from '../password/password.module';
import { AuthController } from './auth.controller';
import { UserCredentialModule } from '../user-credential/user-credential.module';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
        UserCredentialModule,
        PasswordModule,
    ],
    providers: [AuthService],
    exports: [],
    controllers: [AuthController],
})
export class AuthModule {}
