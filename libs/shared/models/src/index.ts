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
