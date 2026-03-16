import { Injectable, LoggerService } from '@nestjs/common';
import pino, { Logger as PinoInstance } from 'pino';

const isServer = typeof window === 'undefined';

export const pinoInstance: PinoInstance = pino({
    level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
    browser: { asObject: true },
    transport:
        isServer && process.env['NODE_ENV'] !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
});

@Injectable()
export class Logger implements LoggerService {
    // Use specific types instead of any
    log(message: string, context?: string) {
        pinoInstance.info(context ? { context } : {}, message);
    }

    error(message: string, trace?: string, context?: string) {
        pinoInstance.error({ trace, context }, message);
    }

    warn(message: string, context?: string) {
        pinoInstance.warn(context ? { context } : {}, message);
    }

    debug(message: string, context?: string) {
        pinoInstance.debug(context ? { context } : {}, message);
    }
}
