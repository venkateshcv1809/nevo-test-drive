import { Exclude, Expose, Type } from 'class-transformer';
import { DateAvailabilityResponse, TimeSlot, VehicleLocation, VehicleGroup } from '@nevo/models';

/**
 * Vehicle Location DTO
 */
export class VehicleLocationDto implements VehicleLocation {
    @Expose() locationId!: string;
    @Expose() locationName!: string;
    @Expose() availableDays!: string[];
}

export class VehicleGroupDto implements VehicleGroup {
    @Expose() vehicleType!: string;
    @Expose() vehicleName!: string;

    @Expose()
    @Type(() => VehicleLocationDto)
    locations!: Record<string, VehicleLocationDto>;
}

/**
 * Date Availability Response DTO
 */
export class TimeSlotDto implements TimeSlot {
    @Expose()
    time!: string;

    @Expose()
    displayTime!: string;

    @Expose()
    available!: boolean;

    @Expose()
    reason?: string;
}

export class DateAvailabilityResponseDto implements DateAvailabilityResponse {
    @Expose()
    date!: string;

    @Expose()
    @Type(() => TimeSlotDto)
    timeSlots!: TimeSlotDto[];

    @Exclude()
    internalDatabaseId?: string;
}
