import { mockVehicles, setCache } from './vehicles.mock';
import { Vehicle, VehicleTimeSlotTemplate } from './vehicles.types';

export function generateWeeklyTimeSlots(vehicle: Vehicle): { [day: string]: string[] } {
    const slots: { [day: string]: string[] } = {};

    vehicle.availableDays.forEach((day) => {
        slots[day] = generateTimeSlotsForDay(
            vehicle.availableFromTime,
            vehicle.availableToTime,
            vehicle.minimumMinutesBetweenBookings
        );
    });

    return slots;
}

export function generateTimeSlotsForDay(
    startTime: string,
    endTime: string,
    intervalMinutes: number
): string[] {
    const slots: string[] = [];

    // Parse times (remove seconds if present)
    const start = startTime.split(':').slice(0, 2).join(':');
    const end = endTime.split(':').slice(0, 2).join(':');

    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        slots.push(timeString);

        // Add 45 minutes for the slot duration + interval minutes for gap
        currentMin += 45 + intervalMinutes;
        if (currentMin >= 60) {
            currentHour += Math.floor(currentMin / 60);
            currentMin = currentMin % 60;
        }
    }

    return slots;
}

export function getDayOfWeek(dateString: string): string {
    const date = new Date(dateString);
    const days = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
    return days[date.getDay()];
}

export function updateTimeSlotsCache(): VehicleTimeSlotTemplate[] {
    const timeSlots: VehicleTimeSlotTemplate[] = [];
    mockVehicles.forEach((vehicle) => {
        timeSlots.push({
            type: vehicle.type,
            location: vehicle.location,
            weeklySlots: generateWeeklyTimeSlots(vehicle),
        });
    });

    setCache('timeSlots', timeSlots);
    return timeSlots;
}
