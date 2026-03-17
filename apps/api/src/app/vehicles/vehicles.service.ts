import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@nevo/prisma';
import { Logger } from '@nevo/logger';
import { VehicleResponse } from './vehicles.types';

@Injectable()
export class VehiclesService {
    private readonly BOOKING_DURATION_MINS = 45;

    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: Logger
    ) {}

    /**
     * Fetch optimized vehicle/location map
     */
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

    /**
     * Fetch multi-date availability for the UI grid
     */
    async getMultiDateAvailability(dto: {
        vehicleType: string;
        location: string;
        dates: string[];
    }) {
        const vehicles = await this.prisma.vehicle.findMany({
            where: { type: dto.vehicleType, locationId: dto.location },
        });

        if (vehicles.length === 0) return [];

        return Promise.all(
            dto.dates.map(async (isoDate) => {
                const date = new Date(isoDate);
                const reservations = await this.getReservationsForDay(vehicles, date);

                const timeSlots = this.generateTimeSlots(vehicles, date).map((slot) => ({
                    time: slot.isoTimestamp.toISOString(),
                    displayTime: `${slot.isoTimestamp.getUTCHours().toString().padStart(2, '0')}:${slot.isoTimestamp.getUTCMinutes().toString().padStart(2, '0')}`,
                    available: this.isAnyVehicleAvailable(
                        vehicles,
                        reservations,
                        slot.isoTimestamp
                    ),
                }));

                return {
                    date: isoDate,
                    timeSlots,
                    status: this.calculateStatus(timeSlots),
                };
            })
        );
    }

    /**
     * Called by BookingService to ensure the car is still free before saving.
     * Returns the specific Vehicle object that is free.
     */
    async validateFinalSelection(
        vehicleType: string,
        locationId: string,
        requestedIso: string,
        tx?: any
    ) {
        const client = tx || this.prisma; // Use transaction client if passed from BookingService

        const vehicles = await client.vehicle.findMany({
            where: { type: vehicleType, locationId: locationId },
        });

        const requestedDate = new Date(requestedIso);
        const reservations = await this.getReservationsForDay(vehicles, requestedDate, client);

        // Find the first vehicle that can fit this slot
        const freeVehicle = vehicles.find((v: any) => {
            const end = new Date(
                requestedDate.getTime() + (this.BOOKING_DURATION_MINS + v.interval) * 60000
            );
            return this.checkVehicleFreedom(v, reservations, requestedDate, end);
        });

        if (!freeVehicle) {
            throw new ConflictException('The selected time slot is no longer available.');
        }

        return freeVehicle;
    }

    /**
     * SHARED LOGIC: Determines if a vehicle is free for a specific window
     */
    private checkVehicleFreedom(
        vehicle: any,
        reservations: any[],
        start: Date,
        end: Date
    ): boolean {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const dayCode = days[start.getUTCDay()];

        if (!vehicle.availableDays.includes(dayCode)) return false;

        const vFrom = this.combineDateTime(start, vehicle.availableFrom);
        const vTo = this.combineDateTime(start, vehicle.availableTo);
        if (start < vFrom || end > vTo) return false;

        const isBooked = reservations.some(
            (res) =>
                res.vehicleId === vehicle.vehicleId &&
                start < new Date(res.endDateTime) &&
                end > new Date(res.startDateTime)
        );

        return !isBooked;
    }

    private isAnyVehicleAvailable(vehicles: any[], reservations: any[], slotTime: Date): boolean {
        if (slotTime < new Date()) return false;
        return vehicles.some((v) => {
            const end = new Date(
                slotTime.getTime() + (this.BOOKING_DURATION_MINS + v.interval) * 60000
            );
            return this.checkVehicleFreedom(v, reservations, slotTime, end);
        });
    }

    private generateTimeSlots(vehicles: any[], date: Date) {
        const slots: { time: string; isoTimestamp: Date }[] = [];
        const startHour = Math.min(...vehicles.map((v) => new Date(v.availableFrom).getUTCHours()));
        const endHour = Math.max(...vehicles.map((v) => new Date(v.availableTo).getUTCHours()));
        const interval = Math.min(...vehicles.map((v) => v.interval));

        for (let hour = startHour; hour < endHour; hour++) {
            for (let min = 0; min < 60; min += interval) {
                const slotDate = new Date(date);
                slotDate.setUTCHours(hour, min, 0, 0);
                slots.push({
                    time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
                    isoTimestamp: slotDate,
                });
            }
        }
        return slots;
    }

    private async getReservationsForDay(vehicles: any[], date: Date, client: any = this.prisma) {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);
        return client.reservation.findMany({
            where: {
                vehicleId: { in: vehicles.map((v) => v.vehicleId) },
                status: 'B',
                startDateTime: { gte: start, lte: end },
            },
        });
    }

    private combineDateTime(base: Date, time: Date): Date {
        const d = new Date(base);
        d.setUTCHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);
        return d;
    }

    private calculateStatus(slots: any[]): 'high' | 'limited' | 'booked' {
        const total = slots.filter((s) => s.available).length;

        if (total === 0) return 'booked';
        // Ensure these strings match the interface exactly
        return total < 5 ? 'limited' : 'high';
    }
}
