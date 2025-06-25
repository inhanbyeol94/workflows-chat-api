import { IsNotEmpty, IsString } from 'class-validator';

export class UserChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
