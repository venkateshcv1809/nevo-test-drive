export interface Vehicle {
    id: string; // vehicleId from DB
    type: string;
    name: string;
    location: string;
    availableFromTime: Date; // Now a Date object for UTC handling
    availableToTime: Date;
    availableDays: string[]; // e.g., ["MON", "TUE"]
    interval: number; // Replaces minimumMinutesBetweenBookings
}

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

/** * Step 1: Optimized Vehicle Map
 */
export type VehicleResponse = Record<string, VehicleGroup>;

/** * Step 2: Time Slots for the Grid
 */
export interface TimeSlot {
    time: string; // Full ISO String: "2026-03-17T08:00:00.000Z"
    displayTime: string; // For UI display: "08:00"
    available: boolean;
    reason?: string;
}

export interface DateAvailabilityResponse {
    date: string; // ISO Date: "2026-03-17"
    timeSlots: TimeSlot[];
    status: 'high' | 'limited' | 'booked';
}

/** * Requests
 */
export interface MultiDateAvailabilityRequest {
    vehicleType: string;
    location: string;
    dates: string[]; // Array of ISO dates ["2026-03-17", "2026-03-18"]
}

export interface FinalValidationRequest {
    vehicleType: string;
    locationId: string;
    requestedIso: string; // Single ISO point: "2026-03-17T10:15:00.000Z"
}
