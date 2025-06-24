import { Injectable, ValidationPipe as NestValidationPipe } from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
    constructor() {
        super({
            whitelist: true, // 허용되지 않은 속성 제거
            transform: true, // DTO로 변환
            stopAtFirstError: true, // 첫 번째 오류에서 중지
            transformOptions: {
                enableImplicitConversion: true, // 타입 변환 허용
            },
        });
    }
}
