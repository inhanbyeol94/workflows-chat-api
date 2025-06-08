import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { CommonController } from '../../common/common.controller';

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
}
