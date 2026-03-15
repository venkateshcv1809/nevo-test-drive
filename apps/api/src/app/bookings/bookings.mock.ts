import { Booking } from './bookings.types';

export const mockBookings: Booking[] = [
    {
        id: 'booking_001',
        vehicleId: 'tesla_1001',
        date: '2024-03-20',
        timeSlot: '10:00',
        customerName: 'Alice Johnson',
        customerEmail: 'alice@example.com',
        customerPhone: '+1234567890',
        status: 'confirmed',
        createdAt: '2024-03-19T15:30:00Z',
    },
    {
        id: 'booking_002',
        vehicleId: 'tesla_1004',
        date: '2024-03-20',
        timeSlot: '14:00',
        customerName: 'Bob Smith',
        customerEmail: 'bob@example.com',
        customerPhone: '+0987654321',
        status: 'confirmed',
        createdAt: '2024-03-19T16:00:00Z',
    },
    {
        id: 'booking_003',
        vehicleId: 'tesla_1002',
        date: '2024-03-21',
        timeSlot: '11:00',
        customerName: 'Carol White',
        customerEmail: 'carol@example.com',
        customerPhone: '+1122334455',
        status: 'cancelled',
        createdAt: '2024-03-18T10:00:00Z',
        cancelledAt: '2024-03-19T09:00:00Z',
    },
];
