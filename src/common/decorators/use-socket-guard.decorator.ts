import { applyDecorators, UseGuards } from '@nestjs/common';
import { SocketGuard } from '@common/guards/socket.guard';

export const UseSocketGuard = applyDecorators(UseGuards(SocketGuard));
