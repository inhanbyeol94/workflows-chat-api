import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class User {
    @ApiProperty({ description: '아이디' })
    @IsInt()
    id: number;

    @ApiProperty({ description: '권한 1: 일반, 99: 마스터' })
    @IsInt()
    role: number;

    @ApiProperty({ description: '이름' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: '프로필 사진', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    profileImageUrl: string | null;

    @ApiProperty({ description: '이메일', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email: string | null;

    @ApiProperty({ description: '전화번호 000-0000-0000', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phoneNumber: string | null;

    @ApiProperty({ description: '사원코드', required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    employeeCode: string | null;

    @ApiProperty({ description: '생성일' })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ description: '수정일', required: false })
    @IsOptional()
    @IsDate()
    updatedAt: Date | null;

    @ApiProperty({ description: '삭제일', required: false })
    @IsOptional()
    @IsDate()
    deletedAt: Date | null;
}
