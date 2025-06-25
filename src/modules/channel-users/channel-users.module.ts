import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { ChannelModule } from '@modules/channel/channel.module';
import { ChannelUsersService } from '@modules/channel-users/channel-users.service';

@Module({
    imports: [UserModule, ChannelModule],
    providers: [ChannelUsersService],
})
export class ChannelUsersModule {}
