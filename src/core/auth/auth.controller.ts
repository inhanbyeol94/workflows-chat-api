import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { CommonController } from '../../common/common.controller';
import { AppRequest } from '../../global/types/request.type';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController extends CommonController {
    constructor(private service: AuthService) {
        super('인증');
    }

    @Post('sign-in')
    async signIn(@Body() body: AuthSignInDto) {
        const accessToken = await this.service.signIn(body);
        return this.response('성공', { accessToken });
    }

    @Get()
    @ApiBearerAuth()
    getPayload(@Req() req: AppRequest) {
        const payload = this.service.getPayload(req.headers.authorization?.split(' ')[1] ?? '');
        return this.response('성공', payload);
    }
}
