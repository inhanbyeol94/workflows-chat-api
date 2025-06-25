import { Module } from '@nestjs/common';
import { ChannelUsersService } from '@modules/channel-users/channel-users.service';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [ChannelUsersService],
})
export class ChannelUsersModule {}
