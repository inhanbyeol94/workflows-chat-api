import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './auth.type';
import { AppRequest } from '../_global/types/request.type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private jwtService: JwtService) {}
    use(req: AppRequest, res: any, next: (error?: any) => void): any {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            req['user'] = this.jwtService.decode<Payload | null>(token);
        }
        next();
    }
}
