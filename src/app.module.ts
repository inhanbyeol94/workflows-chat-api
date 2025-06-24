import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ChannelModule } from '@modules/channel/channel.module';
import { AuthGuard } from '@common/guards/auth.guard';
import { AuthMiddleware } from '@common/middlewares/auth.middleware';
import { AuthModule } from '@modules/auth/auth.module';
import { ExceptionFilter } from '@common/filters/exception.filter';
import { ValidationPipe } from '@common/pipes/validation.pipe';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        AuthModule,
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
