import { mockVehicles, setCache } from './vehicles.mock';
import { Vehicle, GroupedVehicle, LocationInfo, VehicleTimeSlotTemplate } from './vehicles.types';

export function groupVehiclesByType(vehicles: Vehicle[]): GroupedVehicle[] {
    const grouped: Record<string, GroupedVehicle> = {};
    const locationMap: Record<string, LocationInfo[]> = {};

    vehicles.forEach((vehicle) => {
        const typeKey = vehicle.type;
        if (!locationMap[typeKey]) {
            locationMap[typeKey] = [];
        }

        const existingLocation = locationMap[typeKey].find(
            (loc) => loc.location === vehicle.location
        );

        if (!existingLocation) {
            locationMap[typeKey].push({
                location: vehicle.location,
                availableDays: vehicle.availableDays,
                vehicleIds: [vehicle.id],
            });
        } else {
            existingLocation.vehicleIds.push(vehicle.id);
        }
    });

    vehicles.forEach((vehicle) => {
        if (!grouped[vehicle.type]) {
            grouped[vehicle.type] = {
                type: vehicle.type,
                name: vehicle.name,
                locations: locationMap[vehicle.type] || [],
            };
        }
    });

    return Object.values(grouped);
}

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

        // Add interval
        currentMin += intervalMinutes;
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

// Non-blocking cache update function
export function updateCache(groupedVehicles: GroupedVehicle[]): void {
    // Use setTimeout to make it non-blocking
    setTimeout(() => {
        const timeSlots: VehicleTimeSlotTemplate[] = [];
        mockVehicles.forEach((vehicle) => {
            timeSlots.push({
                type: vehicle.type,
                location: vehicle.location,
                weeklySlots: generateWeeklyTimeSlots(vehicle),
            });
        });

        // Update both caches in single shot
        setCache(groupedVehicles, timeSlots);
    }, 0); // Run after current execution stack
}
