import { ResponseDto } from './response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class NoDataResponseDto extends ResponseDto {
    @ApiProperty({ example: null, description: '응답 데이터' })
    data: unknown;
}
