export interface Booking {
    id: string;
    vehicleId: string;
    date: string;
    timeSlot: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: 'confirmed' | 'cancelled';
    createdAt: string;
    cancelledAt?: string;
}

export interface CreateBookingRequest {
    vehicleType: string;
    location: string;
    date: string;
    timeSlot: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

export interface BookingResponse {
    success: boolean;
    bookingId?: string;
    status?: string;
    message?: string;
}

export interface BookingDetails {
    id: string;
    vehicle: {
        id: string;
        type: string;
        name: string;
        location: string;
    };
    date: string;
    timeSlot: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: 'confirmed' | 'cancelled';
    createdAt: string;
    cancelledAt?: string;
}

export interface CancellationResponse {
    message: string;
    cancelledAt: string;
}
