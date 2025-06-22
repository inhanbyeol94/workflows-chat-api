import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Role } from '../../common/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@WebSocketGateway(81, { namespace: 'chat' })
export class ChatGateway {
    @WebSocketServer()
    server;
    constructor() {}

    @SubscribeMessage('test')
    test(@MessageBody() data: string) {
        console.log('Received data:', data);
        return true;
    }
}
