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
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/request.dto';
import { BookingResponseDto, BookingDetailsDto, CancellationResponseDto } from './dto/response.dto';

@Controller('bookings')
@UseInterceptors(ClassSerializerInterceptor)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    /**
     * POST /bookings
     * Receives the user details and the ISO timestamp for the slot
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBooking(@Body() createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
        return this.bookingsService.createBooking(createBookingDto);
    }

    /**
     * GET /bookings/:id
     * Fetches detailed info about a specific booking
     */
    @Get(':id')
    async getBooking(@Param('id') id: string): Promise<BookingDetailsDto> {
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
    async cancelBooking(@Param('id') id: string): Promise<CancellationResponseDto> {
        return this.bookingsService.cancelBooking(id);
    }
}
