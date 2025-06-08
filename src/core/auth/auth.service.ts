import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialService } from '../../resources/user-credential/user-credential.service';
import { ConfigService } from '@nestjs/config';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userCredentialService: UserCredentialService,
        private passwordService: PasswordService,
        private configService: ConfigService,
    ) {}

    async signIn(data: AuthSignInDto) {
        const resource = await this.userCredentialService.findByLoginIdWithUserOrThrow(data.loginId);
        const compare = await this.passwordService.compare(data.password, resource.pepper, resource.password);
        if (!compare) throw new ConflictException('비밀번호가 일치하지 않습니다.');
        return this.signAccessToken(resource.id, resource.user.role);
    }

    private async signAccessToken(id: number, role: number) {
        return this.jwtService.signAsync(
            {
                id,
                role,
            },
            {
                expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
                secret: this.configService.get<string>('JWT_SECRET'),
            },
        );
    }

    private getPayload(token: string) {
        return this.jwtService.decode<{ id: number; role: number } | null>(token);
    }
}
