import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    get databaseUrl(): string {
        const url = process.env['DATABASE_URL'];
        if (!url) {
            throw new Error('❌ DATABASE_URL is not defined in .env');
        }
        return url;
    }

    get port(): number {
        return parseInt(process.env['API_PORT'] || '8080', 10);
    }

    get nodeEnv(): string {
        return process.env['NODE_ENV'] || 'development';
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get debugMode(): boolean {
        return process.env['DEBUG'] === 'true';
    }

    get logLevel(): string {
        return process.env['LOG_LEVEL'] || (this.isDevelopment ? 'debug' : 'info');
    }

    get corsOrigins(): string[] {
        return process.env['CORS_ORIGINS']?.split(',') || [];
    }

    // Booking configuration
    get maxDateSelections(): number {
        return parseInt(process.env['MAX_DATE_SELECTIONS'] || '3', 10);
    }

    get bookingDaysAhead(): number {
        return parseInt(process.env['BOOKING_DAYS_AHEAD'] || '14', 10);
    }

    get timeSlotDuration(): number {
        return parseInt(process.env['TIME_SLOT_DURATION'] || '45', 10); // minutes
    }
}
