import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
    constructor(private configService: ConfigService) {
        super();
    }
    async onModuleInit() {
        await this.$connect();
    }
}
