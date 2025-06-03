import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
    @IsInt()
    role: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    profileImageUrl: string | null;
}
