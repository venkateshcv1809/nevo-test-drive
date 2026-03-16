import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { VehicleResponse } from '../data/models';

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
