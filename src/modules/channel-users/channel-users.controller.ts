import { Body, Controller, Post } from '@nestjs/common';
import { ChannelUsersService } from '@modules/channel-users/channel-users.service';
import { UserRegisterDto } from '@modules/user/dto/user-register.dto';
import { BaseController } from '@modules/base/base.controller';
import { NoDataResponseDto } from '@common/dto/no-data-response.dto';

@Controller()
export class ChannelUsersController extends BaseController {
    constructor(private service: ChannelUsersService) {
        super('_');
    }

    @Post('users')
    async userRegister(@Body() body: UserRegisterDto): Promise<NoDataResponseDto> {
        await this.service.userRegister(body);
        return this.response('사용자 등록이 완료되었습니다.');
    }
}
