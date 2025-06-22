import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Payload } from './auth.type';
import { Reflector } from '@nestjs/core';
import { Role } from '../../common/decorators/role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const role = this.reflector.get(Role, context.getHandler());

        if (!role) return true;

        const request: Request = context.switchToHttp().getRequest();
        const websocket = context.switchToWs().getClient();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) return false;

        try {
            const payload = this.jwtService.verify<Payload>(token, { secret: this.configService.get<string>('JWT_SECRET') });
            return role <= payload.role;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
