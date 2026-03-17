import { Controller, Get, Param, Query, ParseArrayPipe } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehicleResponse, DateAvailabilityResponse } from './vehicles.types';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    /**
     * GET /vehicles
     * Returns the optimized map for the first step of the booking flow
     */
    @Get()
    async getVehicles(): Promise<VehicleResponse> {
        return await this.vehiclesService.getVehicles();
    }

    /**
     * GET /vehicles/:type/location/:location/availability?dates=2026-03-17,2026-03-18
     * Returns the grid of UTC-safe slots for the requested dates
     */
    @Get(':type/location/:location/availability')
    async getTypeLocationMultiAvailability(
        @Param('type') type: string,
        @Param('location') location: string,
        @Query('dates', new ParseArrayPipe({ items: String, separator: ',' })) dates: string[]
    ): Promise<DateAvailabilityResponse[]> {
        // The service now handles the ISO -> UTC conversion internally
        return this.vehiclesService.getMultiDateAvailability({
            vehicleType: type,
            location,
            dates,
        });
    }
}
