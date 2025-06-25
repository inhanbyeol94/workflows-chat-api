import { UserModifyDto } from '@modules/user/dto/user-modify.dto';
import { OmitType } from '@nestjs/swagger';

export class UserModifyMyProfileDto extends OmitType(UserModifyDto, ['employeeCode', 'password', 'role', 'loginId'] as const) {}
