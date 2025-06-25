import { Controller } from '@nestjs/common';
import { ChannelUsersService } from '@modules/channel-users/channel-users.service';
import { BaseController } from '@modules/base/base.controller';

@Controller()
export class ChannelUsersController extends BaseController {
    constructor(private service: ChannelUsersService) {
        super('_');
    }
}
