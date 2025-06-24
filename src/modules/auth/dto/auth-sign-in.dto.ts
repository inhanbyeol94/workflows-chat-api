import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInDto {
    @IsNotEmpty()
    @IsString()
    loginId: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
