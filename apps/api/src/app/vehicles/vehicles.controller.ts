import { Controller, Get } from '@nestjs/common';
import { VehiclesService, GroupedVehicle } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @Get()
    async getVehicles(): Promise<GroupedVehicle[]> {
        return this.vehiclesService.getVehicles();
    }
}
