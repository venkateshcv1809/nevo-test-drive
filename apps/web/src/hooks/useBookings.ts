import {
    BookingDetails,
    BookingResponse,
    CancellationResponse,
    CreateBookingRequest,
} from '@nevo/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useCreateBooking = () => {
    return useMutation({
        mutationFn: async (bookingData: CreateBookingRequest) => {
            const { data } = await api.post<BookingResponse>('/bookings', bookingData);
            return data;
        },
    });
};

export const useGetBooking = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: async () => {
            const { data } = await api.get<BookingDetails>(`/bookings/${id}`);
            return data;
        },
        enabled: !!id,
    });
};

export const useCancelBooking = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.delete<CancellationResponse>(`/bookings/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking', id] });
        },
    });
};
