import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
    constructor(private configService: ConfigService) {
        super();
    }
    async onModuleInit() {
        await this.$connect();
    }
}
