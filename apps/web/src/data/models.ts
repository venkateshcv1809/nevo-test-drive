/**
 * API Response Models
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
 * UI Models
 */
export interface Summary {
    vehicleId: string;
    vehicleName: string;
    locationId: string;
    locationName: string;
    startDateTime: string;
    endDateTime: string;
}

// API Response Models

export interface TimeSlot {
    time: string;
    available: boolean;
    reason?: string;
}

// UI Models (derived from API)
export interface Vehicle {
    id: string;
    type: string;
    name: string;
    locations: string[];
}

export interface Booking {
    id: string;
    vehicle: Vehicle;
    location: string;
    date: Date;
    startTime: string;
    endTime: string;
    customerInfo: CustomerInfo;
    status: 'confirmed' | 'cancelled';
    cancelledAt?: Date;
}

export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}
