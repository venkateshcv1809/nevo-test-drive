// Booking configuration with environment variable support
export const BOOKING_CONFIG = {
    MAX_DATE_SELECTIONS: parseInt(process.env.MAX_DATE_SELECTIONS || '3', 10),
    BOOKING_DAYS_AHEAD: parseInt(process.env.BOOKING_DAYS_AHEAD || '14', 10),
    TIME_SLOT_DURATION: parseInt(process.env.TIME_SLOT_DURATION || '45', 10), // minutes
} as const;

// Debug logging for configuration (development only)
if (process.env.NODE_ENV === 'development' && process.env.DEBUG === 'true') {
    console.log('📊 Booking Configuration:', BOOKING_CONFIG);
}
