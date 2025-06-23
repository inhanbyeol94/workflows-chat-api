import { applyDecorators, UseGuards } from '@nestjs/common';
import { SocketGuard } from '../../global/guards/socket.guard';

export const UseSocketGuard = applyDecorators(UseGuards(SocketGuard));
