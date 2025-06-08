import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Database } from '../../core/database/database';
import { PasswordService } from '../../core/password/password.service';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { NotFoundException } from '@nestjs/common';
import { UserUpdateDto } from './dto/user-update.dto';

describe('UserService', () => {
    let service: UserService;
    let database: Database;
    let passwordService: PasswordService;
    let userCredentialService: UserCredentialService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, Database, PasswordService, UserCredentialService],
        }).compile();

        service = module.get<UserService>(UserService);
        database = module.get<Database>(Database);
        passwordService = module.get<PasswordService>(PasswordService);
        userCredentialService = module.get<UserCredentialService>(UserCredentialService);

        // 테스트 전에 기존 사용자 삭제 (청소)
        await database.user.deleteMany({ where: { credential: { loginId: 'test@example.com' } } });
    });

    afterEach(async () => {
        // 테스트 후 생성된 사용자 삭제 (청소)
        await database.user.deleteMany({ where: { credential: { loginId: 'test@example.com' } } });
        await database.$disconnect();
    });

    describe('register', () => {
        it('사용자를 성공적으로 등록해야 합니다', async () => {
            // Given
            const registerDto: UserRegisterDto = {
                loginId: 'test@example.com',
                password: 'Password123!',
                name: '테스트 사용자',
                email: 'test@example.com',
            };

            // When
            const result = await service.register(registerDto);

            // Then
            expect(result).toBeDefined();
            expect(result.name).toBe(registerDto.name);
            expect(result.email).toBe(registerDto.email);
            expect(result.id).toBeDefined();
        });
    });

    describe('findByIdOrThrow', () => {
        it('존재하는 사용자 ID로 사용자를 찾아야 합니다', async () => {
            // Given
            const registerDto: UserRegisterDto = {
                loginId: 'test@example.com',
                password: 'Password123!',
                name: '테스트 사용자',
                email: 'test@example.com',
            };
            const createdUser = await service.register(registerDto);

            // When
            const result = await service.findByIdOrThrow(createdUser.id);

            // Then
            expect(result).toBeDefined();
            expect(result.id).toBe(createdUser.id);
            expect(result.name).toBe(registerDto.name);
            expect(result.email).toBe(registerDto.email);
        });

        it('존재하지 않는 사용자 ID로 조회 시 NotFoundException을 던져야 합니다', async () => {
            // Given
            const nonExistentUserId = 999999;

            // When & Then
            await expect(service.findByIdOrThrow(nonExistentUserId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('사용자 정보를 성공적으로 업데이트해야 합니다', async () => {
            // Given
            const registerDto: UserRegisterDto = {
                loginId: 'test@example.com',
                password: 'Password123!',
                name: '테스트 사용자',
                email: 'test@example.com',
            };
            const createdUser = await service.register(registerDto);

            const updateDto: UserUpdateDto = {
                name: '업데이트된 사용자',
                email: 'updated@example.com',
            };

            // When
            const result = await service.update(createdUser.id, updateDto);

            // Then
            expect(result).toBeDefined();
            expect(result.id).toBe(createdUser.id);
            expect(result.name).toBe(updateDto.name);
            expect(result.email).toBe(updateDto.email);
        });

        it('존재하지 않는 사용자 ID로 업데이트 시 NotFoundException을 던져야 합니다', async () => {
            // Given
            const nonExistentUserId = 999999;
            const updateDto: UserUpdateDto = {
                name: '업데이트된 사용자',
                email: 'updated@example.com',
            };

            // When & Then
            await expect(service.update(nonExistentUserId, updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('softDelete', () => {
        it('사용자를 성공적으로 논리 삭제해야 합니다', async () => {
            // Given
            const registerDto: UserRegisterDto = {
                loginId: 'test@example.com',
                password: 'Password123!',
                name: '테스트 사용자',
                email: 'test@example.com',
            };
            const createdUser = await service.register(registerDto);

            // When
            const result = await service.softDelete(createdUser.id);

            // Then
            expect(result).toBeDefined();
            expect(result.id).toBe(createdUser.id);
            expect(result.deletedAt).toBeDefined();

            // 삭제된 사용자 조회 시도하면 NotFoundException이 발생해야 함
            await expect(service.findByIdOrThrow(createdUser.id)).rejects.toThrow(NotFoundException);
        });

        it('존재하지 않는 사용자 ID로 삭제 시 NotFoundException을 던져야 합니다', async () => {
            // Given
            const nonExistentUserId = 999999;

            // When & Then
            await expect(service.softDelete(nonExistentUserId)).rejects.toThrow(NotFoundException);
        });
    });
});
