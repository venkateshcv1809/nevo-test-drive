import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nevo/prisma';
import { Logger } from '@nevo/logger';
import { VehiclesService } from '../vehicles/vehicles.service';
import {
    CreateBookingRequest,
    BookingResponse,
    BookingDetails,
    CancellationResponse,
} from './bookings.types';

@Injectable()
export class BookingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly vehiclesService: VehiclesService,
        private readonly logger: Logger
    ) {}

    /**
     * Create a new booking using a Transaction and the VehiclesService Oracle
     */
    async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                // 1. Ask VehiclesService to find a free vehicle for this EXACT UTC moment
                // We pass 'tx' so the validation happens inside the lock
                const freeVehicle = await this.vehiclesService.validateFinalSelection(
                    request.vehicleType,
                    request.location,
                    request.requestedIso, // Use the ISO string from the frontend
                    tx
                );

                // 2. Generate a unique Business ID
                const bookingId = `NEVO-${Date.now()}`;

                // 3. Create the record in the database
                const newBooking = await tx.reservation.create({
                    data: {
                        reservationId: bookingId,
                        vehicleId: freeVehicle.vehicleId,
                        startDateTime: new Date(request.requestedIso),
                        // VehiclesService handles the duration/interval logic
                        endDateTime: new Date(
                            new Date(request.requestedIso).getTime() + 60 * 60000
                        ),
                        customerName: request.customerName,
                        customerEmail: request.customerEmail,
                        customerPhone: request.customerPhone,
                        status: 'confirmed',
                    },
                });

                return {
                    success: true,
                    bookingId: newBooking.reservationId,
                    status: newBooking.status,
                };
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                return { success: false, message: error.message };
            }
            throw error;
        }
    }

    /**
     * Get booking details directly from DB
     */
    async getBookingDetails(id: string): Promise<BookingDetails | null> {
        const booking = await this.prisma.reservation.findUnique({
            where: { reservationId: id },
            include: { vehicle: true }, // Joins with vehicle table
        });

        if (!booking) throw new NotFoundException('Booking not found');

        return {
            id: booking.reservationId,
            vehicle: {
                id: booking.vehicle.vehicleId,
                type: booking.vehicle.type,
                name: booking.vehicle.name,
                location: booking.vehicle.location,
            },
            date: booking.startDateTime.toISOString(),
            timeSlot: booking.startDateTime.toISOString(), // Use ISO for global safety
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            status: booking.status,
            createdAt: booking.createdAt.toISOString(),
        };
    }

    /**
     * Cancel a booking (Soft Delete)
     * This frees up the vehicle for the VehiclesService immediately
     */
    async cancelBooking(id: string): Promise<CancellationResponse | null> {
        try {
            // Check if it exists first
            const booking = await this.prisma.reservation.findUnique({
                where: { reservationId: id },
            });

            if (!booking) return null;

            if (booking.status === 'cancelled') {
                return {
                    message: 'Booking already cancelled',
                    cancelledAt: booking.updatedAt.toISOString(),
                };
            }

            // Update status in Database
            const updatedBooking = await this.prisma.reservation.update({
                where: { reservationId: id },
                data: {
                    status: 'cancelled',
                    // updatedAt is usually handled by Prisma automatically,
                    // but we can be explicit if needed.
                },
            });

            return {
                message: 'Booking cancelled successfully',
                cancelledAt: updatedBooking.updatedAt.toISOString(),
            };
        } catch (error) {
            this.logger.error(`Failed to cancel booking ${id}`);
            throw error;
        }
    }
}
