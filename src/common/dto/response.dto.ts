import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
    @ApiProperty({ description: '응답 코드', type: Number })
    code: number;

    @ApiProperty({ description: '응답 메시지', type: String })
    message: string;
}
