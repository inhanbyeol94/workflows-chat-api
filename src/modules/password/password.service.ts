import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    constructor() {}

    async hash(password: string, pepper: string) {
        if (!password || !pepper) throw new Error('패스워드 혹은 페퍼가 제공되지 않았습니다.');
        return bcrypt.hash(password + pepper, 10);
    }

    async compare(password: string, pepper: string, hash: string) {
        return bcrypt.compare(password + pepper, hash);
    }

    getPepper() {
        return crypto.randomBytes(20).toString('hex');
    }
}
