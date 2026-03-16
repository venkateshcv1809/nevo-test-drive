import { Module } from '@nestjs/common';
import { Logger } from './logger.service';

@Module({
    controllers: [],
    providers: [Logger],
    exports: [Logger],
})
export class LoggerModule {}
