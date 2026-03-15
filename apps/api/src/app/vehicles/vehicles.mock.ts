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
