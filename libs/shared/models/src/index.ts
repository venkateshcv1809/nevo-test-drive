/**
 * Vehicle Location Interface
 */
export interface VehicleLocation {
    locationId: string;
    locationName: string;
    availableDays: string[];
}

export interface VehicleGroup {
    vehicleType: string;
    vehicleName: string;
    locations: Record<string, VehicleLocation>;
}

export type VehicleResponse = Record<string, VehicleGroup>;

/**
 * Time Slot Interface
 */
export interface TimeSlot {
    time: string;
    displayTime: string;
    available: boolean;
    reason?: string;
}

export interface DateAvailabilityResponse {
    date: string;
    timeSlots: TimeSlot[];
}

/**
 * Booking Request Interface
 */
export interface CreateBookingRequest {
    vehicleType: string;
    location: string;
    requestedIso: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

/**
 * Booking Response Interface
 */
export interface BookingResponse {
    success: boolean;
    bookingId?: string;
    status?: 'BOOKED' | 'COMPLETED' | 'DELETED';
    message?: string;
}

export interface BookingVehicle {
    id: string;
    type: string;
    name: string;
    location: string;
}

/**
 * Booking Details Interface
 */
export interface BookingDetails {
    id: string;
    vehicle: BookingVehicle;
    date: string;
    timeSlot: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: 'BOOKED' | 'COMPLETED' | 'DELETED';
    createdAt: string;
}

/**
 * Cancellation Response Interface
 */
export interface CancellationResponse {
    success: boolean;
    bookingId: string;
    status: 'DELETED';
    message: string;
}
