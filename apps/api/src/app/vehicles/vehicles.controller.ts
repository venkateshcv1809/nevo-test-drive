import { Controller, Get, Param, Query, ParseArrayPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { DateAvailabilityResponse, VehicleResponse } from './vehicles.types';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @Get()
    async getVehicles(): Promise<VehicleResponse> {
        return await this.vehiclesService.getVehicles();
    }

    @Get(':type/location/:location/availability')
    async getTypeLocationMultiAvailability(
        @Param('type') type: string,
        @Param('location') location: string,
        @Query('dates', ParseArrayPipe) dates: string[]
    ): Promise<DateAvailabilityResponse[]> {
        return this.vehiclesService.getMultiDateAvailability({
            vehicleType: type,
            location,
            dates,
        });
    }
}
