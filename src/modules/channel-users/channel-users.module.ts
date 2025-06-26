import { Module } from '@nestjs/common';
import { ChannelUsersService } from '@modules/channel-users/channel-users.service';
import { DatabaseModule } from '@modules/database/database.module';
import { ChannelModule } from '@modules/channel/channel.module';

@Module({
    imports: [DatabaseModule, ChannelModule],
    providers: [ChannelUsersService],
})
export class ChannelUsersModule {}
