import { ConflictException, Injectable } from '@nestjs/common';
import { Database } from '../../core/database/database';

@Injectable()
export class UserCredentialService {
    constructor(private prisma: Database) {}

    async checkLoginIdDuplicate(loginId: string, id?: number | null) {
        const resource = await this.prisma.userCredential.findFirst({
            where: { loginId, user: { deletedAt: null } },
        });
        //비어있으면 true, 아이디가 리소스 아이디랑 맞지않으면 false
        if (resource && (!id || resource.id !== id)) {
            throw new ConflictException('이미 사용중인 아이디입니다.');
        }
    }
}
