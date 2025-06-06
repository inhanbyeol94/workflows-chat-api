import { Database } from '../../core/database/database';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { PasswordService } from '../../core/password/password.service';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserChangePasswordDto } from './dto/user-change-password.dto';

@Injectable()
export class UserService {
    constructor(
        private prisma: Database,
        private passwordService: PasswordService,
        private userCredentialService: UserCredentialService,
    ) {}

    /**
     * 사용자 등록
     * 사용자 등록 시, 로그인 아이디 중복 체크를 수행합니다.
     * 사용자 등록 시, 비밀번호는 해싱되어 저장됩니다.
     * */
    async register(data: UserRegisterDto) {
        const { loginId, password, ...d } = data;
        await this.userCredentialService.checkLoginIdDuplicate(loginId);
        const pepper = this.passwordService.getPepper();
        const hash = await this.passwordService.hash(password, pepper);
        return this.prisma.user.create({
            data: {
                ...d,
                credential: {
                    create: {
                        loginId,
                        password: hash,
                        pepper,
                    },
                },
            },
        });
    }

    /**
     * id로 사용자 조회
     * 사용자 id로 사용자 정보를 조회하며, 조회 결과가 없으면 NotFoundException을 던집니다.
     * */
    async findByIdOrThrow(id: number) {
        const resource = await this.prisma.user.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!resource) throw new NotFoundException();
        return resource;
    }

    /**
     * id로 사용자 업데이트
     * 사용자 id로 사용자를 업데이트하며, 조회 결과가 없으면 NotFoundException을 던집니다.
     * */
    async update(id: number, data: UserUpdateDto) {
        await this.findByIdOrThrow(id);
        return this.prisma.user.update({
            where: {
                id,
                deletedAt: null,
            },
            data,
        });
    }

    /**
     * id로 사용자 논리삭제
     * 사용자 id로 사용자를 논리 삭제합니다 서로관계인 credential도 함께 논리 삭제됩니다.
     * */
    async softDelete(id: number) {
        await this.findByIdOrThrow(id);
        return this.prisma.user.update({
            where: {
                id,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                credential: {
                    update: {
                        deletedAt: new Date(),
                    },
                },
            },
        });
    }
}
