/**
 * The core Reservation object from the Database
 */
export interface Booking {
    id: string; // Maps to reservationId
    vehicleId: string;
    startDateTime: string; // ISO 8601 String
    endDateTime: string; // ISO 8601 String
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: 'confirmed' | 'cancelled' | 'pending';
    createdAt: string; // ISO 8601 String
    cancelledAt?: string;
}

/**
 * Request payload from the Frontend
 */
export interface CreateBookingRequest {
    vehicleType: string;
    location: string;
    requestedIso: string; // The "Z" string (e.g., 2026-03-17T10:00:00Z)
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

/**
 * Standard API Response
 */
export interface BookingResponse {
    success: boolean;
    message?: string;
    bookingId?: string;
    status?: string;
}

/**
 * Detailed view (used for "My Bookings" or Confirmation pages)
 */
export interface BookingDetails {
    id: string;
    vehicle: {
        id: string;
        type: string;
        name: string;
        location: string;
    };
    date: string; // ISO String
    timeSlot: string; // ISO String
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: string;
    createdAt: string;
    cancelledAt?: string;
}

export interface CancellationResponse {
    message: string;
    cancelledAt: string;
}

/**
 * Response returned when a user successfully cancels
 */
export interface CancellationResponse {
    message: string;
    cancelledAt: string; // ISO 8601 string from the database 'updatedAt'
}

/**
 * Optional: If you want to allow users to provide a reason
 */
export interface CancelBookingRequest {
    bookingId: string;
    reason?: string;
}
