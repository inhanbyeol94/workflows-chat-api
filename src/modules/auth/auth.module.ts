import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PasswordModule } from '../password/password.module';
import { AuthController } from './auth.controller';
import { UserModule } from '@modules/user/user.module';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
        UserModule,
        PasswordModule,
    ],
    providers: [AuthService],
    exports: [],
    controllers: [AuthController],
})
export class AuthModule {}
