import { Injectable } from '@nestjs/common';
import { mockVehicles, mockVehicleTypes } from './vehicles.mock';
import { GroupedVehicle } from './vehicles.types';
import { groupVehiclesByType, updateCache } from './vehicles.utils';

@Injectable()
export class VehiclesService {
    async getVehicles(): Promise<GroupedVehicle[]> {
        // Cache hit: return cached grouped data
        if (mockVehicleTypes.length !== 0) {
            return mockVehicleTypes;
        }

        // Cache miss: generate, cache, and return
        const list = groupVehiclesByType(mockVehicles);
        updateCache(list);
        return list;
    }
}
