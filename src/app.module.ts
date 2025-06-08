import { Module } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
    ],
    providers: [],
})
export class AppModule {}
