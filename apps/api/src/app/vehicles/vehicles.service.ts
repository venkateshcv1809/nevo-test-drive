import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@nevo/prisma';
import { Logger } from '@nevo/logger';
import { mockVehicles, mockVehicleTimeSlots } from './vehicles.mock';
import {
    TimeSlot,
    DateAvailabilityRequest,
    DateAvailabilityResponse,
    MultiDateAvailabilityRequest,
    VehicleResponse,
} from './vehicles.types';
import { updateTimeSlotsCache } from './vehicles.utils';

@Injectable()
export class VehiclesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger
    ) {}
    async getVehicles(): Promise<VehicleResponse> {
        this.logger.log('Generating optimized vehicle lookup map');

        try {
            const dbVehicles = await this.prisma.vehicle.findMany();

            return dbVehicles.reduce(
                (acc, vehicle) => {
                    if (!acc[vehicle.type]) {
                        acc[vehicle.type] = {
                            vehicleType: vehicle.type,
                            vehicleName: vehicle.name,
                            locations: {},
                        };
                    }

                    if (!acc[vehicle.type].locations[vehicle.locationId]) {
                        acc[vehicle.type].locations[vehicle.locationId] = {
                            locationId: vehicle.locationId,
                            locationName: vehicle.location,
                            availableDays: vehicle.availableDays,
                        };
                    }

                    return acc;
                },
                {} as Record<string, any>
            );
        } catch (error) {
            this.logger.error('Failed to generate vehicle lookup');
            throw error;
        }
    }

    private isInBookingWindow(date: string): boolean {
        const requestedDate = new Date(date);
        const today = new Date();
        const windowEnd = new Date(today);
        windowEnd.setDate(today.getDate() + 13);

        // Normalize all dates to midnight for proper comparison
        const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const normalizedWindowEnd = new Date(
            windowEnd.getFullYear(),
            windowEnd.getMonth(),
            windowEnd.getDate()
        );
        const normalizedRequestedDate = new Date(
            requestedDate.getFullYear(),
            requestedDate.getMonth(),
            requestedDate.getDate()
        );

        // Check if date is in current booking window
        return (
            normalizedRequestedDate >= normalizedToday &&
            normalizedRequestedDate <= normalizedWindowEnd
        );
    }

    private validateDate(date: string): void {
        const isValid = this.isInBookingWindow(date);

        if (!isValid) {
            throw new BadRequestException(`Date ${date} is outside 14-day booking window`);
        }
    }

    private sortDates(dates: string[]): string[] {
        return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    }

    async getDateAvailability(request: DateAvailabilityRequest): Promise<DateAvailabilityResponse> {
        // Initialize time slot cache if empty
        if (mockVehicleTimeSlots.length === 0) {
            updateTimeSlotsCache();
        }

        this.validateDate(request.date);

        // Find vehicle details by type and location
        const vehicle = mockVehicles.find(
            (v) => v.type === request.vehicleType && v.location === request.location
        );

        if (!vehicle) {
            throw new Error(
                `No vehicle found for type ${request.vehicleType} at location ${request.location}`
            );
        }

        // Find time slot template for this vehicle type and location
        const slotTemplate = mockVehicleTimeSlots.find(
            (template) =>
                template.type === request.vehicleType && template.location === request.location
        );

        if (!slotTemplate) {
            throw new Error(
                `No time slot template found for type ${request.vehicleType} at location ${request.location}`
            );
        }

        // Get day of week
        const dayOfWeek = new Date(request.date)
            .toLocaleDateString('en-US', { weekday: 'short' })
            .toLowerCase();

        // Get slots for the specific day
        const daySlots = slotTemplate.weeklySlots[dayOfWeek] || [];

        // Convert to TimeSlot format (all available for now)
        const timeSlots: TimeSlot[] = daySlots.map((time) => ({
            time,
            available: true,
            reason: '',
        }));

        return {
            vehicleType: request.vehicleType,
            location: request.location,
            date: request.date,
            timeSlots,
        };
    }

    async getMultiDateAvailability(
        request: MultiDateAvailabilityRequest
    ): Promise<DateAvailabilityResponse[]> {
        request.dates.forEach((date) => this.validateDate(date));

        const promises = request.dates.map((date) =>
            this.getDateAvailability({
                vehicleType: request.vehicleType,
                location: request.location,
                date,
            })
        );

        const results = await Promise.all(promises);

        return this.sortDates(results.map((r) => r.date)).map(
            (date) => results.find((r) => r.date === date) as DateAvailabilityResponse
        );
    }
}
