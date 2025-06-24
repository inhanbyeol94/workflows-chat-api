import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthPayload } from '@modules/auth/auth.type';

@Injectable()
export class SocketGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const socket = context.switchToWs().getClient<Socket>();
        const headers = socket.handshake.headers;
        const token = headers?.authorization?.split(' ')[1];
        if (!token) throw new WsException('인증 토큰이 없습니다.');
        try {
            const payload = this.jwtService.verify<AuthPayload>(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            return true;
        } catch (error) {
            throw new WsException('토큰이 만료되었거나 잘못된 토큰입니다.');
        }
    }
}
