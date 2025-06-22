import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SOCKET_PORT = 2052;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const swaggerConfig = new DocumentBuilder().setTitle('Chat API').addBearerAuth().build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory());
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
