import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject, UseFilters } from '@nestjs/common';
import { UseSocketGuard } from '@common/decorators/use-socket-guard.decorator';
import { ExceptionFilter } from '@common/filters/exception.filter';
import { OnEvent } from '@nestjs/event-emitter';
import { Channel, User } from '@database/prisma/client';

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

    @OnEvent('channel.join-message')
    handleJoinMessageEvents(channelId: number, user: User) {
        this.server.to(channelId.toString()).emit('join', { channelId, user });
    }

    @OnEvent('channel.delete')
    handleDeleteEvents(channel: Channel) {
        this.server.to(channel.id.toString()).emit('delete', channel);
    }

    @OnEvent('channel.update')
    handleUpdateEvents(channel: Channel) {
        this.server.to(channel.id.toString()).emit('update', channel);
    }
}
