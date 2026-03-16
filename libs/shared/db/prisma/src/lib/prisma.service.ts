import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Logger } from '@nevo/logger';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn' | 'info'>
    implements OnModuleInit, OnModuleDestroy
{
    constructor(private readonly logger: Logger) {
        const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'warn' },
            ],
        });
    }

    async onModuleInit() {
        await this.$connect();

        this.$on('query', (e: Prisma.QueryEvent) => {
            this.logger.debug(`${e.query} -- ${e.params}`, `Prisma Query (${e.duration}ms)`);
        });

        this.$on('error', (e: Prisma.LogEvent) => {
            this.logger.error(e.message, 'Prisma Error');
        });

        this.$on('warn', (e: Prisma.LogEvent) => {
            this.logger.warn(e.message, 'Prisma Warning');
        });

        this.$on('info', (e: Prisma.LogEvent) => {
            this.logger.log(e.message, 'Prisma Info');
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
