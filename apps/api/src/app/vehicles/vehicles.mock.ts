import { Vehicle, VehicleTimeSlotTemplate } from './vehicles.types';

export const mockVehicles: Vehicle[] = [
    {
        id: 'tesla_1001',
        type: 'tesla_model3',
        name: 'Tesla Model 3',
        location: 'dublin',
        availableFromTime: '08:00:00',
        availableToTime: '18:00:00',
        availableDays: ['mon', 'tue', 'wed', 'thur', 'fri'],
        minimumMinutesBetweenBookings: 15,
    },
    {
        id: 'tesla_1002',
        type: 'tesla_modelx',
        name: 'Tesla Model X',
        location: 'dublin',
        availableFromTime: '10:00:00',
        availableToTime: '20:00:00',
        availableDays: ['mon', 'tue', 'wed', 'thur', 'fri', 'sat'],
        minimumMinutesBetweenBookings: 15,
    },
    {
        id: 'tesla_1003',
        type: 'tesla_modely',
        name: 'Tesla Model Y',
        location: 'dublin',
        availableFromTime: '10:00:00',
        availableToTime: '16:00:00',
        availableDays: ['fri', 'sat', 'sun'],
        minimumMinutesBetweenBookings: 15,
    },
    {
        id: 'tesla_1004',
        type: 'tesla_model3',
        name: 'Tesla Model 3',
        location: 'cork',
        availableFromTime: '08:00:00',
        availableToTime: '18:00:00',
        availableDays: ['mon', 'tue', 'wed', 'thur', 'fri'],
        minimumMinutesBetweenBookings: 15,
    },
    {
        id: 'tesla_1005',
        type: 'tesla_modelx',
        name: 'Tesla Model X',
        location: 'cork',
        availableFromTime: '10:00:00',
        availableToTime: '20:00:00',
        availableDays: ['mon', 'tue', 'wed', 'thur', 'fri', 'sat'],
        minimumMinutesBetweenBookings: 15,
    },
    {
        id: 'tesla_1006',
        type: 'tesla_modely',
        name: 'Tesla Model Y',
        location: 'cork',
        availableFromTime: '10:00:00',
        availableToTime: '16:00:00',
        availableDays: ['fri', 'sat', 'sun'],
        minimumMinutesBetweenBookings: 15,
    },
];

// Cache types
type CacheType = 'vehicles' | 'timeSlots';

// Runtime cache - initially empty
export let mockVehicleTimeSlots: VehicleTimeSlotTemplate[] = [];

// Cache setter function
export function setCache(type: CacheType, data: VehicleTimeSlotTemplate[]): void {
    switch (type) {
        case 'timeSlots':
            mockVehicleTimeSlots = data as VehicleTimeSlotTemplate[];
            break;
        default:
            throw new Error(`Unknown cache type: ${type}`);
    }
}
