import { Injectable, BadRequestException } from '@nestjs/common';
import { mockVehicles, mockVehicleTypes, mockVehicleTimeSlots } from './vehicles.mock';
import {
    GroupedVehicle,
    TimeSlot,
    DateAvailabilityRequest,
    DateAvailabilityResponse,
    MultiDateAvailabilityRequest,
} from './vehicles.types';
import { updateVehiclesCache, updateTimeSlotsCache } from './vehicles.utils';

@Injectable()
export class VehiclesService {
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

    async getVehicles(): Promise<GroupedVehicle[]> {
        // Cache hit: return cached grouped data
        if (mockVehicleTypes.length !== 0) {
            return mockVehicleTypes;
        }

        return updateVehiclesCache();
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
