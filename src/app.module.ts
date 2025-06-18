import { Module } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/auth/auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
