// API Response Models
export interface VehicleType {
    type: string;
    name: string;
    locations: VehicleLocation[];
}

export interface VehicleLocation {
    location: string;
    availableDays: string[];
    vehicleIds: string[];
}

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

export interface DayAvailability {
    date: Date;
    availableSlots: number;
    totalSlots: number;
    status: 'high' | 'limited' | 'booked' | 'unavailable';
    timeSlots: TimeSlot[];
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
