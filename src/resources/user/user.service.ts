import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { PasswordService } from '../../core/password/password.service';
import { UserCredentialService } from './credential/user-credential.service';
import { UserModifyDto } from './dto/user-modify.dto';
import { UserRepository } from './user.repository';
import { UserArgsFactory } from './user.args.factory';

@Injectable()
export class UserService {
    constructor(
        private passwordService: PasswordService,
        private userCredentialService: UserCredentialService,
        private repository: UserRepository,
    ) {}

    /**
     * ### 등록
     * @role 관리
     * @desc 사용자 등록 시, 로그인 아이디 중복 체크를 수행하며, 비밀번호는 암호회된 후 저장됩니다.
     * @throws ConflictException 로그인 아이디가 중복된 경우
     * */
    async register(data: UserRegisterDto) {
        await this.userCredentialService.checkLoginIdDuplicate(data.loginId);

        const pepper = this.passwordService.getPepper();
        const hash = await this.passwordService.hash(data.password, pepper);

        return this.repository.create(UserArgsFactory.register(data, pepper, hash));
    }

    /**
     * ### 수정
     * @role 관리
     * @desc 민감한 정보를 포함한 사용자 정보를 수정합니다.
     * */
    async modify(id: number, data: UserModifyDto) {
        // 유효성 검증
        await this.findByIdOrThrow(id);

        let pepper: string | undefined;
        let hash: string | undefined;

        if (data.password) {
            // 패스워드 암호화 및 페퍼 업데이트
            pepper = this.passwordService.getPepper();
            hash = await this.passwordService.hash(data.password, pepper);
        }

        if (data.loginId) {
            // 로그인 아이디 중복 체크
            await this.userCredentialService.checkLoginIdDuplicate(data.loginId, id);
        }

        return this.repository.update(UserArgsFactory.modify(id, data, pepper, hash));
    }

    /**
     * ### 탈퇴
     * @role 관리
     * @desc 민감 정보를 포함하여 사용자 정보를 논리삭제합니다. (deletedAt 필드에 현재 시간을 저장)
     * */
    async unregister(id: number) {
        await this.findByIdOrThrow(id);
        return this.repository.update(UserArgsFactory.unregister(id));
    }

    /**
     * ### 단일 조회
     * @role 공통
     * @desc 민감한 정보를 제외한 사용자 정보를 조회합니다.
     * @throws NotFoundException id로 조회된 리소스가 없을 경우
     * */
    async findByIdOrThrow(id: number) {
        const resource = await this.repository.findUnique(UserArgsFactory.findByIdOrThrow(id));
        if (!resource) throw new NotFoundException();
        return resource;
    }
}
