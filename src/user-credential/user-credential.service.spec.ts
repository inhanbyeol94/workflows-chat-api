import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentialService } from './user-credential.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserCredentialModule } from './user-credential.module';
import { UserModule } from '../user.module';
import { DatabaseModule } from '../../../core/database/database.module';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserService } from '../user.service';
import { User } from '../../../core/database/generated/prisma';

describe('사용자 자격증명 서비스(user-credential.service) 통합 테스트', () => {
    let service: UserCredentialService;
    let userService: UserService;
    let user: User;
    const dto: UserRegisterDto = {
        loginId: 'testuser2',
        password: '1234',
        name: '테스트 사용자',
        role: 1,
        email: null,
        profileImageUrl: null,
        phoneNumber: null,
        employeeCode: null,
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UserCredentialModule, UserModule, DatabaseModule],
        }).compile();

        service = module.get<UserCredentialService>(UserCredentialService);
        userService = module.get<UserService>(UserService);

        user = await userService.register(dto);
    });

    describe('로그인 아이디로 조회(findByLoginIdWithUserOrThrow)', () => {
        it('존재하는 아이디로 조회하면 사용자 정보를 반환한다 (should return user when loginId exists)', async () => {
            const result = await service.findByLoginIdWithUserOrThrow(dto.loginId);
            expect(result).toBeDefined();
            expect(result?.user).toBeDefined();
            expect(result.loginId).toBe(dto.loginId);
        });
        it('존재하지 않는 아이디로 조회하면 NotFoundException이 발생한다 (should throw NotFoundException when loginId does not exist)', async () => {
            await expect(service.findByLoginIdWithUserOrThrow('없는아이디')).rejects.toThrow(NotFoundException);
        });
    });

    describe('로그인 아이디 중복 검사(checkLoginIdDuplicate)', () => {
        it('이미 사용중인 아이디면 ConflictException이 발생한다 (should throw ConflictException if loginId is duplicated)', async () => {
            await expect(service.checkLoginIdDuplicate(dto.loginId)).rejects.toThrow(ConflictException);
        });

        it('본인의 로그인 아이디는 예외가 발생하지 않는다.', async () => {
            const test = await service.checkLoginIdDuplicate(dto.loginId, user.id);
            expect(test).toBeUndefined();
        });

        it('사용 가능한 아이디면 예외가 발생하지 않는다 (should not throw if loginId is available)', async () => {
            // 존재하지 않는 loginId로 테스트
            await expect(service.checkLoginIdDuplicate('unique_login_id_123')).resolves.toBeUndefined();
        });
    });

    describe('단일 조회(findByIdOrThrow)', () => {
        it('존재하는 id로 조회하면 사용자 정보를 반환한다 (should return user when id exists)', async () => {
            // 테스트용 id를 실제 DB에 맞게 입력하세요.
            const loginId = 'testuser2';
            const user = await service.findByLoginIdWithUserOrThrow(loginId);
            const result = await service.findByIdOrThrow(user.id);
            expect(result).toBeDefined();
            expect(result.id).toBe(user.id);
        });

        it('존재하지 않는 id로 조회하면 NotFoundException이 발생한다 (should throw NotFoundException when id does not exist)', async () => {
            await expect(service.findByIdOrThrow(99999999)).rejects.toThrow(NotFoundException);
        });
    });
});
