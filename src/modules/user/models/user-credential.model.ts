import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCredential {
    @ApiProperty({ description: '아이디', type: Number })
    @IsInt()
    id: number;

    @ApiProperty({ description: '로그인 아이디', type: String })
    @IsNotEmpty()
    @IsString()
    loginId: string;

    @ApiProperty({ description: '패스워드', type: String })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: '패스워드 조합 값', type: String })
    @IsNotEmpty()
    @IsString()
    pepper: string;

    @ApiProperty({ description: '생성일', type: Date })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: '수정일', required: false, type: Date })
    @IsOptional()
    @IsDate()
    updatedAt: Date | null;

    @ApiProperty({ description: '삭제일', required: false, type: Date })
    @IsOptional()
    @IsDate()
    deletedAt: Date | null;
}
