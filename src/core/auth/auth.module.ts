import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserCredentialModule } from '../../resources/user-credential/user-credential.module';
import { PasswordModule } from '../password/password.module';
import { AuthController } from './auth.controller';

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
