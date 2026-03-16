import { Global, Module } from '@nestjs/common';
import { LoggerModule } from '@nevo/logger';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    imports: [LoggerModule],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
