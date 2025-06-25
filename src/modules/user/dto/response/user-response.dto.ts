import { ResponseDto } from '@common/dto/response.dto';
import { User } from '@modules/user/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto extends ResponseDto {
    @ApiProperty({ description: '사용자' })
    data: User;
}
