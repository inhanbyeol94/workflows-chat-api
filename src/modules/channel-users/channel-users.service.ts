import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UserRegisterDto } from '@modules/user/dto/user-register.dto';
import { ChannelUsersRepository } from '@modules/channel-users/channel-users.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChannelUsersService {
    constructor(
        private userService: UserService,
        private channelService: ChannelService,
        private repository: ChannelUsersRepository,
        private eventEmitter: EventEmitter2,
    ) {}

    /**
     * ### 회원가입
     * @step1 사용자 리소스 생성
     * @step2 공개 채널 목록을 조회 후 채널에 사용자 연결
     * @step3 현재 접속자들에게 공개 채널에 사용자 참여알림 요청 (Socket)
     * */
    async userRegister(data: UserRegisterDto) {
        // 사용자 가입 후 정보 반환
        const user = await this.userService.register(data);

        // 공개 채널 조회
        const publicChannels = await this.channelService.findManyByPublic();

        // 공개 채널에 사용자 연결
        await this.repository.createMany({
            data: publicChannels.map((channel) => ({
                channelId: channel.id,
                userId: user.id,
            })),
        });

        // 공개 채널에 사용자 참여 알림 요청
        publicChannels.forEach((channel) => {
            this.eventEmitter.emit('channel.join-message', { channelId: channel.id, userId: user.id });
        });

        return user;
    }
}
