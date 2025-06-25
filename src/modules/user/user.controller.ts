import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { Role } from '@common/decorators/role.decorator';
import { ROLE } from '@modules/user/user.role';
import { UserRegisterDto } from '@modules/user/dto/user-register.dto';
import { BaseController } from '@modules/base/base.controller';
import { UserModifyDto } from '@modules/user/dto/user-modify.dto';
import { UserModifyMyProfileDto } from '@modules/user/dto/user-modify-my-profile.dto';
import { User } from '@common/decorators/user.decorator';
import { AuthPayload } from '@modules/auth/auth.type';
import { UserResponseDto } from '@modules/user/dto/response/user-response.dto';
import { NoDataResponseDto } from '@common/dto/no-data-response.dto';
import { UserChangePasswordDto } from '@modules/user/dto/user-change-password.dto';

@Controller('users')
export class UserController extends BaseController {
    constructor(private service: UserService) {
        super('사용자');
    }

    /**
     * 등록
     * */
    @Post()
    @Role(ROLE.MASTER)
    async register(@Body() body: UserRegisterDto): Promise<UserResponseDto> {
        const resource = await this.service.register(body);
        return this.response(this.REGISTER_MESSAGE, resource);
    }

    /**
     * 내 정보 수정
     * */
    @Patch('my')
    @Role(ROLE.NORMAL)
    async modifyMyProfile(@User() user: AuthPayload, @Body() body: UserModifyMyProfileDto): Promise<UserResponseDto> {
        const resource = await this.service.modify(user.id, body);
        return this.response('프로필 수정이 완료되었습니다.', resource);
    }

    /**
     * 내 패스워드 수정
     * */
    @Patch('my/password')
    @Role(ROLE.NORMAL)
    async changePassword(@User() user: AuthPayload, @Body() body: UserChangePasswordDto): Promise<NoDataResponseDto> {
        await this.service.changePassword(user.id, body);
        return this.response('패스워드 변경이 완료되었습니다.');
    }

    /**
     * 정보 수정
     * */
    @Patch(':id')
    @Role(ROLE.MASTER)
    async modify(@Param('id', ParseIntPipe) id: number, @Body() body: UserModifyDto): Promise<UserResponseDto> {
        const resource = await this.service.modify(id, body);
        return this.response(this.MODIFY_MESSAGE, resource);
    }

    /**
     * 내 정보 조회
     * */
    @Get('my')
    @Role(ROLE.NORMAL)
    async findMyProfile(@User() user: AuthPayload): Promise<UserResponseDto> {
        const resource = await this.service.findByIdOrThrow(user.id);
        return this.response(this.FIND_MESSAGE, resource);
    }

    /**
     * 단일 조회
     * */
    @Get(':id')
    @Role(ROLE.NORMAL)
    async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        const resource = await this.service.findByIdOrThrow(id);
        return this.response(this.FIND_MESSAGE, resource);
    }
}
