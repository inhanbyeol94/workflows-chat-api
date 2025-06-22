import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { SOCKET_PORT } from '../../main';

@WebSocketGateway(SOCKET_PORT, { namespace: 'channel' })
export class ChannelGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    constructor(@Inject(forwardRef(() => ChannelService)) private service: ChannelService) {}

    afterInit() {
        this.server.use((socket: Socket, next) => {
            const headers = socket.handshake.headers;
            const token = headers?.authorization?.split(' ')[1];
            if (!token) throw new WsException('인증되지 않은 사용자입니다.');
            next();
        });
    }

    /**
     * ### 채널 동기화
     * */
    @SubscribeMessage('sync')
    async sync(@ConnectedSocket() client: Socket, @MessageBody() { userId }: { userId: number }) {
        const resources = await this.service.findManyByUserId(userId);
        await client.join(resources.map((r) => r.id.toString()));
        client.emit('sync', resources);
    }
}
