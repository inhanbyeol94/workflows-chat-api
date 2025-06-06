import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Database } from '../../core/database/database';
import { PasswordService } from '../../core/password/password.service';
import { UserCredentialChangePassword } from './user-credential.type';

@Injectable()
export class UserCredentialService {
    constructor(
        private prisma: Database,
        private passwordService: PasswordService,
    ) {}

    async checkLoginIdDuplicate(loginId: string, id?: number | null) {
        const resource = await this.prisma.userCredential.findFirst({
            where: { loginId, user: { deletedAt: null } },
        });
        //비어있으면 true, 아이디가 리소스 아이디랑 맞지않으면 false
        if (resource && (!id || resource.id !== id)) {
            throw new ConflictException('이미 사용중인 아이디입니다.');
        }
    }

    async findByIdOrThrow(id: number) {
        const resource = await this.prisma.userCredential.findUnique({
            where: { id, user: { deletedAt: null } },
        });
        if (!resource) throw new NotFoundException();
        return resource;
    }

    /*
     * id로 패스워드 변경 및 페퍼 업데이트
     * id로 사용자의 패스워드를 변경하며, 조회 결과가 없으면 NotFoundException을 던집니다.
     * 사용자 패스워드 변경 시, 기존 패스워드와 새 패스워드를 비교하여 유효성을 검사합니다.
     * 사용자 시점 기존 패스워드가 필수로 제공되어야 하며, 새 패스워드는 필수로 제공되어야 합니다.
     * 관리
     *  */
    async changePassword(id: number, { oldPassword, newPassword }: UserCredentialChangePassword) {
        const resource = await this.findByIdOrThrow(id);
        if (oldPassword) {
            const compare = await this.passwordService.compare(oldPassword, resource.pepper, resource.password);
            if (!compare) throw new ConflictException('기존 비밀번호가 일치하지 않습니다.');
        }
        const pepper = this.passwordService.getPepper();
        const hash = await this.passwordService.hash(newPassword, pepper);

        return this.prisma.userCredential.update({
            where: { id },
            data: {
                password: hash,
                pepper,
            },
        });
    }
}
