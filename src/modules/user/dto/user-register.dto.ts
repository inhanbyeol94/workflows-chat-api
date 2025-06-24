import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    loginId: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsInt()
    role: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    profileImageUrl: string | null;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email: string | null;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phoneNumber: string | null;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    employeeCode: string | null;
}
