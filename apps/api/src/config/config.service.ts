import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    // Database configuration
    get databaseUrl(): string {
        return (
            process.env.DATABASE_URL ||
            'postgresql://nevo_user:nevo_password@localhost:5432/nevo_test_drive'
        );
    }

    // Application configuration
    get port(): number {
        return parseInt(process.env.PORT || '8080', 10);
    }

    get nodeEnv(): string {
        return process.env.NODE_ENV || 'development';
    }

    get corsOrigins(): string[] {
        return process.env.CORS_ORIGINS?.split(',') || [];
    }

    // Security configuration
    get jwtSecret(): string {
        return process.env.JWT_SECRET || 'default-secret-change-in-production';
    }

    get jwtExpiresIn(): string {
        return process.env.JWT_EXPIRES_IN || '24h';
    }

    // Rate limiting
    get rateLimitWindowMs(): number {
        return parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes
    }

    get rateLimitMaxRequests(): number {
        return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
    }

    // Booking configuration
    get maxDateSelections(): number {
        return parseInt(process.env.MAX_DATE_SELECTIONS || '3', 10);
    }

    get bookingDaysAhead(): number {
        return parseInt(process.env.BOOKING_DAYS_AHEAD || '14', 10);
    }

    get timeSlotDuration(): number {
        return parseInt(process.env.TIME_SLOT_DURATION || '45', 10); // minutes
    }

    // Development settings
    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get debugMode(): boolean {
        return process.env.DEBUG === 'true';
    }
}
