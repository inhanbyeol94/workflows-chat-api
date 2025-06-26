import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChannelUsersService } from '@modules/channel-users/channel-users.service';
import { BaseController } from '@modules/base/base.controller';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE } from '@modules/user/user.role';
import { Role } from '@common/decorators/role.decorator';
import { User } from '@common/decorators/user.decorator';
import { AuthPayload } from '@modules/auth/auth.type';
import { NoDataResponseDto } from '@common/dto/no-data-response.dto';
import { ChannelUsersInviteDto } from '@modules/channel-users/dto/channel-users-invite.dto';

@Controller()
export class ChannelUsersController extends BaseController {
    constructor(private service: ChannelUsersService) {
        super('_');
    }

    @Post('join/:channelId')
    @ApiBearerAuth()
    @Role(ROLE.NORMAL)
    async join(@User() user: AuthPayload, @Param('channelId', ParseIntPipe) channelId: number): Promise<NoDataResponseDto> {
        await this.service.create(user.id, channelId);
        return this.response('채널 참여가 완료되었습니다.');
    }

    @Post('invite/:channelId')
    @ApiBearerAuth()
    @Role(ROLE.NORMAL)
    async invite(
        @Param('channelId', ParseIntPipe) channelId: number,
        @User() user: AuthPayload,
        @Body() body: ChannelUsersInviteDto,
    ): Promise<NoDataResponseDto> {
        await this.service.invite(channelId, body.userIds, user);
        return this.response('사용자 초대가 완료되었습니다.');
    }
}
