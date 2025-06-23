import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChannelCreateDto {
    @ApiProperty({ description: '이름', type: String })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '비밀 채널 여부', type: Boolean })
    @ApiProperty()
    @IsBoolean()
    isSecret: boolean;

    @ApiProperty({ description: '채널 설명', type: String, required: false })
    @ApiProperty()
    @IsOptional()
    @IsString()
    description: string | null;
}
