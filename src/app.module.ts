import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthMiddleware } from './core/auth/auth.middleware';
import { ChatModule } from './core/chat/chat.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ChannelModule } from './resources/channel/channel.module';
import { ExceptionFilter } from './global/filters/exception.filter';
import { ValidationPipe } from './global/pipes/validation.pipe';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
        ChatModule,
        ChannelModule,
        CacheModule.register({
            isGlobal: true,
            ttl: 0, // 캐시 만료 시간 (0은 만료되지 않음을 의미)
        }),
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AuthMiddleware).forRoutes('*'); // 모든 라우트에 AuthGuard 적용
    }
}
