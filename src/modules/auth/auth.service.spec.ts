import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { PasswordService } from '../password/password.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '@database/prisma/client';
import { UserRegisterDto } from '@modules/user/dto/user-register.dto';
import { UserCredentialModule } from '@modules/user-credential/user-credential.module';
import { PasswordModule } from '@modules/password/password.module';
import { UserModule } from '@modules/user/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserService } from '@modules/user/user.service';

describe('인증 서비스(modules.auth.service) 통합 테스트', () => {
    let service: AuthService;
    let userCredentialService: UserCredentialService;
    let passwordService: PasswordService;
    let jwtService: JwtService;
    let configService: ConfigService;
    let userService: UserService;
    let user: User;

    const dto: UserRegisterDto = {
        loginId: 'authtest',
        password: '1234',
        name: '최초 사용자',
        email: 'a@a.aa',
        role: 1,
        profileImageUrl: null,
        phoneNumber: null,
        employeeCode: null,
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                JwtModule.register({ global: true }),
                UserCredentialModule,
                PasswordModule,
                UserModule,
                AuthModule,
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userCredentialService = module.get<UserCredentialService>(UserCredentialService);
        passwordService = module.get<PasswordService>(PasswordService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        userService = module.get<UserService>(UserService);

        user = await userService.register(dto);
    });

    describe('로그인', () => {
        it('로그인 성공', async () => {
            const accessToken = await service.signIn({
                loginId: dto.loginId,
                password: dto.password,
            });
            expect(accessToken).toBeDefined();
        });
        it('로그인 실패', async () => {
            // 아이디 불일치
            await expect(service.signIn({ loginId: 'nullId', password: '1234' })).rejects.toThrow();

            // 패스워드 불일치
            await expect(service.signIn({ loginId: dto.loginId, password: '12345' })).rejects.toThrow();
        });
    });
});
