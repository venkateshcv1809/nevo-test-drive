import { Global, Module } from '@nestjs/common';
import { Logger } from './logger.service';

@Global()
@Module({
    controllers: [],
    providers: [Logger],
    exports: [Logger],
})
export class LoggerModule {}
