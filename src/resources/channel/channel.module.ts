import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { ChannelService } from './channel.service';
import { ChannelRepository } from './channel.repository';
import { ChannelGateway } from './channel.gateway';
import { UserModule } from '../user/user.module';
import { ChannelController } from './channel.controller';

@Module({
    imports: [DatabaseModule, UserModule],
    controllers: [ChannelController],
    providers: [ChannelService, ChannelRepository, ChannelGateway],
    exports: [],
})
export class ChannelModule {}
