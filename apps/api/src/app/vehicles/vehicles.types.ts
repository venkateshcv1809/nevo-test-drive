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

export interface GroupedVehicle {
    type: string;
    name: string;
    locations: LocationInfo[];
}

export interface LocationInfo {
    location: string;
    availableDays: string[];
    vehicleIds: string[];
}

export interface VehicleTimeSlotTemplate {
    type: string;
    location: string;
    weeklySlots: {
        [day: string]: string[];
    };
}
