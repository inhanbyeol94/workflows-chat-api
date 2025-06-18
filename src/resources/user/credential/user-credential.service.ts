import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordService } from '../../../core/password/password.service';
import { UserCredentialChangePassword } from './user-credential.type';
import { UserCredentialRepository } from './user-credential.repository';
import { UserCredentialArgsFactory } from './user-credential.args.factory';

@Injectable()
export class UserCredentialService {
    constructor(
        private repository: UserCredentialRepository,
        private passwordService: PasswordService,
    ) {}

    /**
     * ### 로그인 아이디로 조회
     * @desc 로그인 아이디 조회 시 deletedAt이 null인 사용자만 조회합니다.
     * @role 공통
     * @include user
     * @throws NotFoundException 아이디가 존재하지 않는 경우
     * */
    async findByLoginIdWithUserOrThrow(loginId: string) {
        const resource = await this.repository.findFirst(UserCredentialArgsFactory.findByLoginIdWithUserOrThrow(loginId));
        if (!resource) throw new NotFoundException('아이디를 찾을 수 없습니다.');
        return resource;
    }

    /**
     * ### 로그인 아이디 중복 검사
     * @desc 로그인 아이디 중복 검사 시 deletedAt이 null인 사용자만 조회하며, id가 제공된 경우 해당 id와 비교하여 중복 여부를 검사합니다.
     * @role 공통
     * @throws ConflictException 이미 사용중인 아이디인 경우
     * */
    async checkLoginIdDuplicate(loginId: string, id?: number | null) {
        const resource = await this.repository.findFirst(UserCredentialArgsFactory.checkLoginIdDuplicate(loginId));
        if (resource && (!id || resource.id !== id)) {
            throw new ConflictException('이미 사용중인 아이디입니다.');
        }
    }

    /**
     * ### 단일 조회
     * @desc id로 단일 조회 시 deletedAt이 null인 사용자만 조회합니다.
     * @role 공통
     * @throws NotFoundException 조회 결과가 존재하지 않는 경우
     * */
    async findByIdOrThrow(id: number) {
        const resource = await this.repository.findUnique(UserCredentialArgsFactory.findByIdOrThrow(id));
        if (!resource) throw new NotFoundException('사용자를 찾을 수 없습니다.');
        return resource;
    }

    /**
     * ### 패스워드 변경
     * @desc 사용자의 패스워드를 변경할 수 있으며, 기존 패스워드일치 시 새 패스워드로 변경합니다.
     * @desc 단, 기존 패스워드가 들어오지 않는 경우 기존 패스워드 검증을 건너뛰며, 패스워드 변경 시 새로운 페퍼를 생성하여 저장합니다.
     * @role 공통
     * @throws NotFoundException 변경 대상이 존재하지 않는 경우
     * @throws ConflictException 기존 패스워드가 일치하지 않는 경우
     * */
    async changePassword(id: number, { oldPassword, newPassword }: UserCredentialChangePassword) {
        const resource = await this.findByIdOrThrow(id);

        if (oldPassword) {
            const compare = await this.passwordService.compare(oldPassword, resource.pepper, resource.password);
            if (!compare) throw new ConflictException('기존 비밀번호가 일치하지 않습니다.');
        }
        const pepper = this.passwordService.getPepper();
        const hash = await this.passwordService.hash(newPassword, pepper);

        return this.repository.update(UserCredentialArgsFactory.changePassword(id, hash, pepper));
    }
}
