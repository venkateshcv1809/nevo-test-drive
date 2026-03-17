import { IsString, IsEmail, IsISO8601, IsNotEmpty } from 'class-validator';
import { CreateBookingRequest } from '@nevo/models';

export class CreateBookingDto implements CreateBookingRequest {
    @IsString()
    @IsNotEmpty()
    vehicleType!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsISO8601()
    @IsNotEmpty()
    requestedIso!: string;

    @IsString()
    @IsNotEmpty()
    customerName!: string;

    @IsEmail()
    customerEmail!: string;

    @IsString()
    @IsNotEmpty()
    customerPhone!: string;
}
