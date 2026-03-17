import { Controller, Get, Param, Query } from '@nestjs/common';
import { DateAvailabilityRequestDto } from './dto/request.dto';
import { DateAvailabilityResponseDto, VehicleGroupDto } from './dto/response.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @Get()
    async getVehicles(): Promise<Record<string, VehicleGroupDto>> {
        return this.vehiclesService.getVehicles();
    }

    @Get(':type/location/:location/availability')
    async getAvailability(
        @Param('type') type: string,
        @Param('location') location: string,
        @Query() query: DateAvailabilityRequestDto
    ): Promise<DateAvailabilityResponseDto[]> {
        return this.vehiclesService.getAvailability({
            vehicleType: type,
            location,
            dates: query.dates,
        });
    }
}
