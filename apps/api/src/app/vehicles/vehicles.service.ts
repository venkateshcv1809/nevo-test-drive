import { Injectable } from '@nestjs/common';
import { Vehicle, mockVehicles } from './vehicles.mock';

export interface GroupedVehicle {
    type: string;
    name: string;
    locations: LocationInfo[];
}

export interface LocationInfo {
    location: string;
    availableDays: string[];
}

@Injectable()
export class VehiclesService {
    async getVehicles(): Promise<GroupedVehicle[]> {
        return this.groupVehiclesByType(mockVehicles);
    }

    private groupVehiclesByType(vehicles: Vehicle[]): GroupedVehicle[] {
        const grouped: Record<string, GroupedVehicle> = {};

        vehicles.forEach((vehicle) => {
            if (!grouped[vehicle.type]) {
                grouped[vehicle.type] = {
                    type: vehicle.type,
                    name: vehicle.name,
                    locations: [],
                };
            }

            const existingLocation = grouped[vehicle.type].locations.find(
                (loc) => loc.location === vehicle.location
            );

            if (!existingLocation) {
                grouped[vehicle.type].locations.push({
                    location: vehicle.location,
                    availableDays: vehicle.availableDays,
                });
            }
        });

        return Object.values(grouped);
    }
}
