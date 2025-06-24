import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { INestApplication } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { DatabaseModule } from '../database/database.module';
import { UserCredentialModule } from '../user-credential/user-credential.module';
import { PasswordModule } from '../password/password.module';
import { UserModifyDto } from './dto/user-modify.dto';

// 실제 DB와 연동되는 통합 테스트입니다.
describe('유저 서비스 통합 테스트 (UserService Integration)', () => {
    let app: INestApplication;
    let userService: UserService;
    let userId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule, UserCredentialModule, PasswordModule, DatabaseModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        userService = moduleFixture.get<UserService>(UserService);

        const dto: UserRegisterDto = {
            loginId: 'initial',
            password: '1234',
            name: '최초 사용자',
            email: 'a@a.aa',
            role: 1,
            profileImageUrl: null,
            phoneNumber: null,
            employeeCode: null,
        };
        const initialUser = await userService.register(dto);
        userId = initialUser.id;
    });

    it('회원등록 성공', async () => {
        const dto: UserRegisterDto = {
            loginId: 'testuser1',
            password: 'TestPassword123!',
            name: '테스트유저',
            email: 'testuser1@example.com',
            role: 1,
            profileImageUrl: null,
            phoneNumber: null,
            employeeCode: null,
        };
        const user = await userService.register(dto);
        expect(user).toBeDefined();
    });
    it('회원등록 시 중복 아이디 예외', async () => {
        const dto: UserRegisterDto = {
            loginId: 'testuser1',
            password: 'TestPassword123!',
            name: '중복유저',
            email: 'duplicate@example.com',
            role: 1,
            profileImageUrl: null,
            phoneNumber: null,
            employeeCode: null,
        };

        await expect(userService.register(dto)).rejects.toBeDefined();
    });
    it('회원정보 수정 성공', async () => {
        const dto: UserModifyDto = {
            loginId: 'initial1',
            password: '1234!',
            name: '중복유저',
            email: 'initial@a.aa',
            role: 99,
            profileImageUrl: null,
            phoneNumber: null,
            employeeCode: null,
        };
        const user = await userService.modify(userId, dto);
        expect(user).toBeDefined();
        expect(user.name).toBe(dto.name);
    });
    it('회원정보 수정 시 없는 유저 예외', async () => {
        const dto: UserModifyDto = {
            name: '없는유저',
            email: 'notfound@example.com',
        };
        await expect(userService.modify(999999, dto)).rejects.toBeDefined();
    });
    it('회원탈퇴 성공', async () => {
        const user = await userService.unregister(userId);
        expect(user).toBeDefined();
        expect(user.deletedAt).toBeDefined();
    });
    it('회원탈퇴 시 없는 유저 예외', async () => {
        await expect(userService.unregister(999999)).rejects.toBeDefined();
    });
});
