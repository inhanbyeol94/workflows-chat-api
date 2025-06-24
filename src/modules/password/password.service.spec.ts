import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
    let service: PasswordService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PasswordService],
        }).compile();

        service = module.get<PasswordService>(PasswordService);
    });

    describe('hash', () => {
        it('비밀번호와 pepper로 해시된 값을 생성한다', async () => {
            const password = 'testPassword123';
            const pepper = 'testPepper123';

            const hash = await service.hash(password, pepper);

            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash.length).toBeGreaterThan(0);
        });

        it('비밀번호가 제공되지 않으면 에러를 던진다', async () => {
            const pepper = 'testPepper123';

            await expect(service.hash('', pepper)).rejects.toThrow('패스워드 혹은 페퍼가 제공되지 않았습니다.');
        });

        it('pepper가 제공되지 않으면 에러를 던진다', async () => {
            const password = 'testPassword123';

            await expect(service.hash(password, '')).rejects.toThrow('패스워드 혹은 페퍼가 제공되지 않았습니다.');
        });
    });

    describe('compare', () => {
        it('올바른 비밀번호와 pepper로 해시값과 비교했을 때 true를 반환한다', async () => {
            const password = 'testPassword123';
            const pepper = 'testPepper123';
            const hash = await service.hash(password, pepper);

            const result = await service.compare(password, pepper, hash);

            expect(result).toBe(true);
        });

        it('잘못된 비밀번호로 해시값과 비교했을 때 false를 반환한다', async () => {
            const password = 'testPassword123';
            const wrongPassword = 'wrongPassword123';
            const pepper = 'testPepper123';
            const hash = await service.hash(password, pepper);

            const result = await service.compare(wrongPassword, pepper, hash);

            expect(result).toBe(false);
        });

        it('잘못된 pepper로 해시값과 비교했을 때 false를 반환한다', async () => {
            const password = 'testPassword123';
            const pepper = 'testPepper123';
            const wrongPepper = 'wrongPepper123';
            const hash = await service.hash(password, pepper);

            const result = await service.compare(password, wrongPepper, hash);

            expect(result).toBe(false);
        });
    });

    describe('getPepper', () => {
        it('40자리의 16진수 문자열을 반환한다', () => {
            const pepper = service.getPepper();

            expect(pepper).toMatch(/^[0-9a-f]{40}$/);
        });

        it('매번 다른 값을 반환한다', () => {
            const pepper1 = service.getPepper();
            const pepper2 = service.getPepper();

            expect(pepper1).not.toBe(pepper2);
        });
    });
});
