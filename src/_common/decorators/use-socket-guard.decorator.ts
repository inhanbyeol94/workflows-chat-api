import { applyDecorators, UseGuards } from '@nestjs/common';
import { SocketGuard } from '../.././_global/guards/socket.guard';

export const UseSocketGuard = applyDecorators(UseGuards(SocketGuard));
