import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nevo/config';
import { Logger } from '@nevo/logger';
import { BookingDetails, BookingResponse, CreateBookingRequest } from '@nevo/models';
import { PrismaService } from '@nevo/prisma';
import { BookingStatus } from '@prisma/client';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CancellationResponseDto } from './dto/response.dto';

@Injectable()
export class BookingsService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly vehiclesService: VehiclesService,
        private readonly logger: Logger
    ) {}

    async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const freeVehicle = await this.vehiclesService.validateFinalSelection(
                    request.vehicleType,
                    request.location,
                    request.requestedIso,
                    tx
                );

                const timestampHex = Date.now().toString(16).toUpperCase();
                const randomSuffix = Math.floor(Math.random() * 0x10000)
                    .toString(16)
                    .toUpperCase()
                    .padStart(4, '0');
                const bookingId = `NEVO-${timestampHex}-${randomSuffix}`;

                const newBooking = await tx.reservation.create({
                    data: {
                        reservationId: bookingId,
                        vehicleId: freeVehicle.vehicleId,
                        startDateTime: new Date(request.requestedIso),
                        endDateTime: new Date(
                            new Date(request.requestedIso).getTime() +
                                this.configService.timeSlotDuration * 60000
                        ),
                        customerName: request.customerName,
                        customerEmail: request.customerEmail,
                        customerPhone: request.customerPhone,
                        status: BookingStatus.BOOKED,
                    },
                });

                return {
                    success: true,
                    bookingId: newBooking.reservationId,
                    status: newBooking.status as BookingStatus,
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
    async getBookingDetails(reservationId: string): Promise<BookingDetails | null> {
        const booking = await this.prisma.reservation.findUnique({
            where: { reservationId },
            include: { vehicle: true },
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
            timeSlot: booking.startDateTime.toISOString(),
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            status: booking.status as BookingStatus,
            createdAt: booking.createdAt.toISOString(),
        };
    }

    /**
     * Cancel a booking (Soft Delete)
     * This frees up the vehicle for the VehiclesService immediately
     */
    async cancelBooking(reservationId: string): Promise<CancellationResponseDto> {
        const booking = await this.prisma.reservation.findUnique({
            where: { reservationId },
        });

        if (!booking) {
            throw new NotFoundException(`Booking ${reservationId} not found`);
        }

        if (booking.status === BookingStatus.DELETED) {
            throw new BadRequestException('This booking is already canceled.');
        }

        const updated = await this.prisma.reservation.update({
            where: { reservationId },
            data: { status: BookingStatus.DELETED },
        });

        return {
            success: true,
            bookingId: updated.reservationId,
            status: 'DELETED',
            message: 'Your reservation has been successfully canceled.',
        };
    }
}
