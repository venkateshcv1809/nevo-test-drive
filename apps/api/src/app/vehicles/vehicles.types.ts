export interface Vehicle {
    id: string;
    type: string;
    name: string;
    location: string;
    availableFromTime: string;
    availableToTime: string;
    availableDays: string[];
    minimumMinutesBetweenBookings: number;
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

export type VehicleResponse = Record<string, VehicleGroup>;

export interface VehicleTimeSlotTemplate {
    type: string;
    location: string;
    weeklySlots: {
        [day: string]: string[];
    };
}

export interface SlotAvailabilityRequest {
    vehicleId: string;
    date: string;
    timeSlot: string;
}

export interface SlotAvailabilityResponse {
    available: boolean;
    reason?: string;
    vehicle?: {
        id: string;
        name: string;
        type: string;
        location: string;
    };
}

export interface TimeSlot {
    time: string;
    available: boolean;
    reason?: string;
}

export interface DateAvailabilityRequest {
    vehicleType: string;
    location: string;
    date: string;
}

export interface MultiDateAvailabilityRequest {
    vehicleType: string;
    location: string;
    dates: string[];
}

export interface DateAvailabilityResponse {
    vehicleType: string;
    location: string;
    date: string;
    timeSlots: TimeSlot[];
}
