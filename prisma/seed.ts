import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Mock vehicle data matching the new schema structure
const mockVehicles = [
    {
        vehicleId: 'tesla_1001',
        type: 'tesla_model3',
        name: 'Tesla Model 3',
        locationId: 'dublin',
        location: 'Dublin',
        availableFrom: new Date('2000-01-01T08:00:00.000Z'),
        availableTo: new Date('2000-01-01T18:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 15,
    },
    {
        vehicleId: 'tesla_1002',
        type: 'tesla_modelx',
        name: 'Tesla Model X',
        locationId: 'dublin',
        location: 'Dublin',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T20:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'THU', 'FRI', 'SAT'],
        interval: 15,
    },
    {
        vehicleId: 'tesla_1003',
        type: 'tesla_modely',
        name: 'Tesla Model Y',
        locationId: 'dublin',
        location: 'Dublin',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T16:00:00.000Z'),
        availableDays: ['FRI', 'SAT', 'SUN'],
        interval: 15,
    },
    {
        vehicleId: 'tesla_1004',
        type: 'tesla_model3',
        name: 'Tesla Model 3',
        locationId: 'cork',
        location: 'Cork',
        availableFrom: new Date('2000-01-01T08:00:00.000Z'),
        availableTo: new Date('2000-01-01T18:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 30,
    },
    {
        vehicleId: 'tesla_1005',
        type: 'tesla_modelx',
        name: 'Tesla Model X',
        locationId: 'cork',
        location: 'Cork',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T20:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 15,
    },
    {
        vehicleId: 'tesla_1006',
        type: 'tesla_modely',
        name: 'Tesla Model Y',
        locationId: 'cork',
        location: 'Cork',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T16:00:00.000Z'),
        availableDays: ['FRI', 'SAT', 'SUN'],
        interval: 15,
    },
    {
        vehicleId: 'tesla_1007',
        type: 'tesla_modely',
        name: 'Tesla Model Y',
        locationId: 'cork',
        location: 'Cork',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T16:00:00.000Z'),
        availableDays: ['FRI', 'SAT', 'SUN'],
        interval: 15,
    },
];

// Mock reservation data matching the new schema structure
const mockReservations = [
    {
        reservationId: 'NEVO-20250316-001',
        vehicleId: 'tesla_1001',
        startDateTime: new Date('2026-03-01T09:00:00.000Z'),
        endDateTime: new Date('2026-03-01T09:45:00.000Z'),
        durationMins: 45,
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+353851234567',
    },
    {
        reservationId: 'NEVO-20250316-002',
        vehicleId: 'tesla_1002',
        startDateTime: new Date('2026-03-01T10:00:00.000Z'),
        endDateTime: new Date('2026-03-01T10:45:00.000Z'),
        durationMins: 45,
        customerName: "Sarah O'Connor",
        customerEmail: 'sarah.oconnor@email.com',
        customerPhone: '+353859876543',
    },
    {
        reservationId: 'NEVO-20250316-003',
        vehicleId: 'tesla_1001',
        startDateTime: new Date('2026-03-01T11:30:00.000Z'),
        endDateTime: new Date('2026-03-01T12:15:00.000Z'),
        durationMins: 45,
        customerName: 'Jill Jones',
        customerEmail: 'jill.jones@email.com',
        customerPhone: '+353879876543',
    },
];

async function main() {
    console.log('🚀 Seeding database...');

    try {
        // 1. Clear existing data to avoid unique constraint errors
        await prisma.reservation.deleteMany();
        await prisma.vehicle.deleteMany();

        console.log('🧹 Cleared existing data');

        // 2. Create vehicles from mock data
        const vehicles = await Promise.all(
            mockVehicles.map((vehicle) =>
                prisma.vehicle.create({
                    data: {
                        vehicleId: vehicle.vehicleId,
                        type: vehicle.type,
                        name: vehicle.name,
                        locationId: vehicle.locationId,
                        location: vehicle.location,
                        availableFrom: vehicle.availableFrom,
                        availableTo: vehicle.availableTo,
                        availableDays: vehicle.availableDays,
                        interval: vehicle.interval,
                    },
                })
            )
        );

        console.log(`✅ Seeded ${vehicles.length} vehicles`);

        // 3. Create reservations from mock data
        const reservations = await Promise.all(
            mockReservations.map((reservation) =>
                prisma.reservation.create({
                    data: {
                        reservationId: reservation.reservationId,
                        vehicleId: reservation.vehicleId,
                        startDateTime: reservation.startDateTime,
                        endDateTime: reservation.endDateTime,
                        customerName: reservation.customerName,
                        customerEmail: reservation.customerEmail,
                        customerPhone: reservation.customerPhone,
                        status: 'B',
                    },
                })
            )
        );

        console.log(`✅ Seeded ${reservations.length} reservations`);

        console.log('🎉 Database seeding completed successfully!');

        // 4. Display summary
        console.log('\n📊 Summary:');
        console.log(`- Vehicles: ${vehicles.length}`);
        console.log(`- Reservations: ${reservations.length}`);
        console.log(`- Locations: ${[...new Set(vehicles.map((v) => v.location))].join(', ')}`);
        console.log(`- Vehicle Types: ${[...new Set(vehicles.map((v) => v.type))].join(', ')}`);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
