import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Role } from '../_common/decorators/role.decorator';
import { ROLE } from '../user/user.role';
import { ChannelCreateDto } from './dto/channel-create.dto';
import { CommonController } from '../_common/common.controller';
import { User } from '../_common/decorators/user.decorator';
import { Payload } from '../auth/auth.type';
import { ChannelModifyDto } from './dto/channel-modify.dto';
import { NoDataResponseDto } from '../_common/dto/no-data-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('channels')
@ApiBearerAuth()
export class ChannelController extends CommonController {
    constructor(private service: ChannelService) {
        super('채널');
    }

    @Post()
    @Role(ROLE.NORMAL)
    async create(@Body() body: ChannelCreateDto, @User() user: Payload): Promise<NoDataResponseDto> {
        await this.service.create(body, user);
        return this.response(this.CREATE_MESSAGE);
    }

    @Patch(':id')
    @Role(ROLE.NORMAL)
    async modify(@Param('id', ParseIntPipe) id: number, @Body() body: ChannelModifyDto, @User() user: Payload): Promise<NoDataResponseDto> {
        await this.service.modify(id, body, user);
        return this.response(this.MODIFY_MESSAGE);
    }

    @Delete(':id')
    @Role(ROLE.NORMAL)
    async delete(@Param('id', ParseIntPipe) id: number, @User() user: Payload): Promise<NoDataResponseDto> {
        await this.service.delete(id, user);
        return this.response(this.DELETE_MESSAGE);
    }
}
