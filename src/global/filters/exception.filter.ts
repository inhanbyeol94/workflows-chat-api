import { ExceptionFilter as NestExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { WsException } from '@nestjs/websockets';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
    catch(exception: HttpException | WsException | Error, host: ArgumentsHost): any {
        const type = host.getType();

        switch (type) {
            case 'http': {
                const ctx = host.switchToHttp();
                const response = ctx.getResponse<Response>();
                const status = exception instanceof HttpException ? exception.getStatus() : 500;
                const message = (() => {
                    if (exception instanceof HttpException) {
                        const getResponse = exception.getResponse();

                        if (typeof getResponse === 'string') {
                            return getResponse;
                        } else if (typeof getResponse === 'object' && getResponse !== null) {
                            const message = getResponse['message'] as string | string[];
                            if (message instanceof Array) {
                                return message[0] ?? '알 수 없는 오류가 발생했습니다';
                            } else {
                                return message;
                            }
                        }
                    }
                    return exception instanceof Error ? exception.message : '알 수 없는 오류가 발생했습니다';
                })();

                response.status(status).json({
                    code: status,
                    message,
                    data: null,
                });
                break;
            }
            case 'ws': {
                // @todo: WebSocket 예외 처리
                break;
            }
        }
    }
}
