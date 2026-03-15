import { Injectable } from '@nestjs/common';
import { mockVehicles } from '../vehicles/vehicles.mock';
import { mockBookings } from './bookings.mock';
import {
    Booking,
    CreateBookingRequest,
    BookingResponse,
    BookingDetails,
    CancellationResponse,
} from './bookings.types';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class BookingsService {
    constructor(private vehiclesService: VehiclesService) {}
    /**
     * Create a new booking
     */
    async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
        // Check if slot is available using vehicles service
        const availabilityResponse = await this.vehiclesService.getDateAvailability({
            vehicleType: request.vehicleType,
            location: request.location,
            date: request.date,
        });

        // Find the specific time slot in availability
        const timeSlotAvailability = availabilityResponse.timeSlots.find(
            (slot) => slot.time === request.timeSlot && slot.available
        );

        if (!timeSlotAvailability) {
            return {
                success: false,
                message: 'Slot not available',
            };
        }

        // Find any available vehicle of this type in this location
        const availableVehicle = mockVehicles.find(
            (v) => v.type === request.vehicleType && v.location === request.location
        );

        if (!availableVehicle) {
            return {
                success: false,
                message: 'No vehicles available for this type and location',
            };
        }

        // Check if slot is already taken for ANY vehicle of this type/location
        const existingBooking = mockBookings.find(
            (booking) =>
                booking.date === request.date &&
                booking.timeSlot === request.timeSlot &&
                booking.status === 'confirmed'
        );

        if (existingBooking) {
            return {
                success: false,
                message: 'Slot not available',
            };
        }

        // Create new booking with first available vehicle
        const newBooking: Booking = {
            id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            vehicleId: availableVehicle.id,
            date: request.date,
            timeSlot: request.timeSlot,
            customerName: request.customerName,
            customerEmail: request.customerEmail,
            customerPhone: request.customerPhone,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };

        // Add to mock data (in real app, this would be database insert)
        mockBookings.push(newBooking);

        return {
            success: true,
            bookingId: newBooking.id,
            status: newBooking.status,
        };
    }

    /**
     * Get booking details with vehicle information
     */
    async getBookingDetails(id: string): Promise<BookingDetails | null> {
        const booking = mockBookings.find((b) => b.id === id);

        if (!booking) {
            return null;
        }

        // Find vehicle details
        const vehicle = mockVehicles.find((v) => v.id === booking.vehicleId);

        if (!vehicle) {
            return null;
        }

        return {
            id: booking.id,
            vehicle: {
                id: vehicle.id,
                type: vehicle.type,
                name: vehicle.name,
                location: vehicle.location,
            },
            date: booking.date,
            timeSlot: booking.timeSlot,
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            status: booking.status,
            createdAt: booking.createdAt,
            cancelledAt: booking.cancelledAt,
        };
    }

    /**
     * Cancel a booking (soft delete)
     */
    async cancelBooking(id: string): Promise<CancellationResponse | null> {
        const booking = mockBookings.find((b) => b.id === id);

        if (!booking) {
            return null;
        }

        if (booking.status === 'cancelled') {
            return {
                message: 'Booking already cancelled',
                cancelledAt: booking.cancelledAt || new Date().toISOString(),
            };
        }

        // Soft delete - update status
        booking.status = 'cancelled';
        booking.cancelledAt = new Date().toISOString();

        return {
            message: 'Booking cancelled successfully',
            cancelledAt: booking.cancelledAt,
        };
    }

    /**
     * Check if a slot is available
     */
    private isSlotAvailable(vehicleId: string, date: string, timeSlot: string): boolean {
        const existingBooking = mockBookings.find(
            (booking) =>
                booking.vehicleId === vehicleId &&
                booking.date === date &&
                booking.timeSlot === timeSlot &&
                booking.status === 'confirmed'
        );

        return !existingBooking;
    }
}
