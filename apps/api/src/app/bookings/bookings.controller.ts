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
    CreateBookingRequest, // Import the updated type
} from './bookings.types';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    /**
     * POST /bookings
     * Receives the user details and the ISO timestamp for the slot
     */
    @Post()
    @HttpCode(HttpStatus.CREATED) // Explicitly set 201
    async createBooking(
        @Body() createBookingDto: CreateBookingRequest // Capture frontend data here
    ): Promise<BookingResponse> {
        return this.bookingsService.createBooking(createBookingDto);
    }

    /**
     * GET /bookings/:id
     * Fetches detailed info about a specific booking
     */
    @Get(':id')
    async getBooking(@Param('id') id: string): Promise<BookingDetails> {
        const booking = await this.bookingsService.getBookingDetails(id);

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return booking;
    }

    /**
     * DELETE /bookings/:id
     * Performs a soft-delete (status = 'cancelled')
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async cancelBooking(@Param('id') id: string): Promise<CancellationResponse> {
        const result = await this.bookingsService.cancelBooking(id);

        if (!result) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }

        return result;
    }
}
