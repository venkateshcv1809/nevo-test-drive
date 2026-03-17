import { Expose, Type } from 'class-transformer';
import { BookingStatus } from '@prisma/client';
import { CancellationResponse } from '@nevo/models';

export class BookingResponseDto {
    @Expose()
    success!: boolean;

    @Expose()
    bookingId?: string;

    @Expose()
    status?: BookingStatus;

    @Expose()
    message?: string;
}

class VehicleDetailsDto {
    @Expose() id!: string;
    @Expose() type!: string;
    @Expose() name!: string;
    @Expose() location!: string;
}

export class BookingDetailsDto {
    @Expose() id!: string;

    @Expose()
    @Type(() => VehicleDetailsDto)
    vehicle!: VehicleDetailsDto;

    @Expose() date!: string;
    @Expose() timeSlot!: string;
    @Expose() customerName!: string;
    @Expose() customerEmail!: string;
    @Expose() customerPhone!: string;
    @Expose() status!: string;
    @Expose() createdAt!: string;
}

export class CancellationResponseDto implements CancellationResponse {
    @Expose()
    success!: boolean;

    @Expose()
    bookingId!: string;

    @Expose()
    status!: 'DELETED';

    @Expose()
    message!: string;
}
