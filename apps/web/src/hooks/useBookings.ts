import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, VehicleType } from '../data/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface BookingDetailsResponse {
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

export interface BookingResponse {
    success: boolean;
    bookingId?: string;
    status?: string;
    message?: string;
}

// API helper functions
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Booking not found');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

// API functions
const getBooking = async (id: string): Promise<BookingDetailsResponse> => {
    return apiRequest<BookingDetailsResponse>(`/v1/api/bookings/${id}`);
};

const createBooking = async (bookingData: {
    vehicleType: string;
    location: string;
    date: string;
    timeSlot: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}): Promise<BookingResponse> => {
    return apiRequest<BookingResponse>('/v1/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    });
};

const cancelBooking = async (id: string) => {
    return apiRequest(`/v1/api/bookings/${id}`, {
        method: 'DELETE',
    });
};

// Vehicles API
const getVehicles = async () => {
    return apiRequest<VehicleType[]>('/v1/api/vehicles');
};

const getVehicleAvailability = async (params: {
    vehicleType: string;
    location: string;
    dates: string[];
}) => {
    if (!params.dates || params.dates.length === 0) {
        return [];
    }

    const datesQuery = params.dates.join(',');
    return apiRequest(
        `/v1/api/vehicles/${params.vehicleType}/location/${params.location}/availability?dates=${datesQuery}`
    );
};

// Transform API response to UI Booking model
const transformBookingData = (bookingData: BookingDetailsResponse): Booking => {
    return {
        id: bookingData.id,
        vehicle: {
            id: bookingData.vehicle.id,
            type: bookingData.vehicle.type,
            name: bookingData.vehicle.name,
            locations: [bookingData.vehicle.location],
        },
        location: bookingData.vehicle.location,
        date: new Date(bookingData.date),
        startTime: bookingData.timeSlot,
        endTime: calculateEndTime(bookingData.timeSlot),
        customerInfo: {
            name: bookingData.customerName,
            email: bookingData.customerEmail,
            phone: bookingData.customerPhone,
        },
        status: bookingData.status,
        cancelledAt: bookingData.cancelledAt ? new Date(bookingData.cancelledAt) : undefined,
    };
};

const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = minutes + 30; // Assuming 30-minute slots
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;

    return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
};

// React Query hooks
export const useBooking = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => getBooking(id),
        enabled: !!id,
        select: transformBookingData,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation<
        BookingResponse,
        Error,
        {
            vehicleType: string;
            location: string;
            date: string;
            timeSlot: string;
            customerName: string;
            customerEmail: string;
            customerPhone: string;
        }
    >({
        mutationFn: createBooking,
        onSuccess: () => {
            // Invalidate bookings list if you have one
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: (_, bookingId) => {
            // Invalidate specific booking and bookings list
            queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

// Vehicles hooks
export const useVehicles = () => {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: getVehicles,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const useVehicleAvailability = (vehicleType: string, location: string, dates: string[]) => {
    // Don't make API call if no dates provided
    if (!dates || dates.length === 0) {
        return useQuery({
            queryKey: ['vehicles', 'availability', vehicleType, location, dates],
            queryFn: () => [],
            enabled: false,
        });
    }

    return useQuery({
        queryKey: ['vehicles', 'availability', vehicleType, location, dates],
        queryFn: () => getVehicleAvailability({ vehicleType, location, dates }),
        enabled: !!(vehicleType && location && dates.length > 0),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
