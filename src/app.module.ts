import { Module } from '@nestjs/common';
import { UserModule } from './resources/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
    ],
    providers: [],
})
export class AppModule {}
