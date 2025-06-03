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
    @IsString()
    profileImageUrl: string | null;
}
