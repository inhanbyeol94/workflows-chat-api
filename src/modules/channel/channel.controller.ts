import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from '@modules/channel/channel.service';
import { Role } from '@common/decorators/role.decorator';
import { ChannelCreateDto } from '@modules/channel/dto/channel-create.dto';
import { ChannelModifyDto } from '@modules/channel/dto/channel-modify.dto';
import { User } from '@common/decorators/user.decorator';
import { NoDataResponseDto } from '@common/dto/no-data-response.dto';
import { ROLE } from '@modules/user/user.role';
import { AuthPayload } from '@modules/auth/auth.type';
import { BaseController } from '@modules/base/base.controller';

@Controller('channels')
@ApiBearerAuth()
export class ChannelController extends BaseController {
    constructor(private service: ChannelService) {
        super('채널');
    }

    @Post()
    @Role(ROLE.NORMAL)
    async create(@Body() body: ChannelCreateDto, @User() user: AuthPayload): Promise<NoDataResponseDto> {
        await this.service.create(body, user);
        return this.response(this.CREATE_MESSAGE);
    }

    @Patch(':id')
    @Role(ROLE.NORMAL)
    async modify(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChannelModifyDto,
        @User() user: AuthPayload,
    ): Promise<NoDataResponseDto> {
        await this.service.modify(id, body, user);
        return this.response(this.MODIFY_MESSAGE);
    }

    @Delete(':id')
    @Role(ROLE.NORMAL)
    async delete(@Param('id', ParseIntPipe) id: number, @User() user: AuthPayload): Promise<NoDataResponseDto> {
        await this.service.delete(id, user);
        return this.response(this.DELETE_MESSAGE);
    }
}
