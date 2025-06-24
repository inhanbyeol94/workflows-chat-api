import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, UseFilters } from '@nestjs/common';
import { UseSocketGuard } from '@common/decorators/use-socket-guard.decorator';
import { ExceptionFilter } from '@common/filters/exception.filter';

@WebSocketGateway(2052, { namespace: 'channel' })
export class ChannelGateway {
    @WebSocketServer()
    server: Server;

    constructor(@Inject(forwardRef(() => ChannelService)) private service: ChannelService) {}

    /**
     * ### 채널 동기화
     * */
    @SubscribeMessage('sync')
    @UseSocketGuard
    @UseFilters(ExceptionFilter)
    async sync(@ConnectedSocket() client: Socket, @MessageBody() { userId }: { userId: number }) {
        const resources = await this.service.findManyByUserId(userId);
        await client.join(resources.map((r) => r.id.toString()));
        client.emit('sync', resources);
    }
}
