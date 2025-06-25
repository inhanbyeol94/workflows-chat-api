import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChannelService } from './channel.service';
import { ChannelGateway } from './channel.gateway';
import { ChannelController } from './channel.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [ChannelController],
    providers: [ChannelService, ChannelGateway],
    exports: [ChannelService, ChannelGateway],
})
export class ChannelModule {}
