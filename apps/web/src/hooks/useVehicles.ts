import { useQuery } from '@tanstack/react-query';
import { DateAvailabilityResponse, VehicleResponse } from '@nevo/models';
import { api } from '../lib/api';

export const useVehicles = () => {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            const { data } = await api.get<VehicleResponse>('/vehicles');
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export const useVehicleAvailability = (
    type: string | null,
    location: string | null,
    dates: string[]
) => {
    return useQuery({
        queryKey: ['availability', type, location, [...dates].sort()],
        queryFn: async () => {
            if (!type || !location || dates.length === 0 || dates.length > 3) return [];

            const { data } = await api.get<DateAvailabilityResponse[]>(
                `/vehicles/${type}/location/${location}/availability`,
                { params: { dates: dates.join(',') } }
            );
            return data;
        },
        enabled: !!type && !!location && dates.length > 0 && dates.length <= 3,
        staleTime: 0,
        refetchOnMount: 'always',
    });
};
