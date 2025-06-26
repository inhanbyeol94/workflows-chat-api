import { IsArray, IsInt } from 'class-validator';

export class ChannelUsersInviteDto {
    @IsArray()
    @IsInt({ each: true })
    userIds: number[];
}
