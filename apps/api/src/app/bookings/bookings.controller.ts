import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    NotFoundException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import {
    BookingDetails,
    BookingResponse,
    CancellationResponse,
    CreateBookingRequest,
} from './bookings.types';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post()
    async createBooking(@Body() request: CreateBookingRequest): Promise<BookingResponse> {
        return this.bookingsService.createBooking(request);
    }

    @Get(':id')
    async getBooking(@Param('id') id: string): Promise<BookingDetails> {
        const booking = await this.bookingsService.getBookingDetails(id);

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return booking;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async cancelBooking(@Param('id') id: string): Promise<CancellationResponse> {
        const result = await this.bookingsService.cancelBooking(id);

        if (!result) {
            throw new NotFoundException('Booking not found');
        }

        return result;
    }
}
