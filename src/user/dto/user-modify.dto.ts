import { UserRegisterDto } from './user-register.dto';
import { PartialType } from '@nestjs/swagger';

export class UserModifyDto extends PartialType(UserRegisterDto) {}
