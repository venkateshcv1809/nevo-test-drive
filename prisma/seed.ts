import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

// 1. Manually build the URL to avoid .env interpolation issues during execution
const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    DATABASE_URL,
} = process.env;

// Use the full DATABASE_URL if it exists and doesn't contain ${},
// otherwise fall back to manual construction.
const connectionString =
    DATABASE_URL && !DATABASE_URL.includes('${')
        ? DATABASE_URL
        : `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

console.log(`🔗 Connecting to: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`);

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Mock vehicle data matching the new schema structure
const mockVehicles = [
    {
        id: 'tesla_1001',
        vehicleId: 'TESLA-M3-DUB-001',
        type: 'tesla_model3',
        location: 'dublin',
        availableFrom: new Date('2000-01-01T08:00:00.000Z'),
        availableTo: new Date('2000-01-01T18:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 30,
    },
    {
        id: 'tesla_1002',
        vehicleId: 'TESLA-M3-DUB-002',
        type: 'tesla_model3',
        location: 'dublin',
        availableFrom: new Date('2000-01-01T08:00:00.000Z'),
        availableTo: new Date('2000-01-01T18:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 30,
    },
    {
        id: 'tesla_1003',
        vehicleId: 'TESLA-MX-DUB-001',
        type: 'tesla_modelx',
        location: 'dublin',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T20:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        interval: 15,
    },
    {
        id: 'tesla_1004',
        vehicleId: 'TESLA-M3-COR-001',
        type: 'tesla_model3',
        location: 'cork',
        availableFrom: new Date('2000-01-01T08:00:00.000Z'),
        availableTo: new Date('2000-01-01T18:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 15,
    },
    {
        id: 'tesla_1005',
        vehicleId: 'TESLA-MX-COR-001',
        type: 'tesla_modelx',
        location: 'cork',
        availableFrom: new Date('2000-01-01T10:00:00.000Z'),
        availableTo: new Date('2000-01-01T20:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        interval: 15,
    },
    {
        id: 'tesla_1006',
        vehicleId: 'TESLA-MY-SFO-001',
        type: 'tesla_modely',
        location: 'san_francisco',
        availableFrom: new Date('2000-01-01T16:00:00.000Z'),
        availableTo: new Date('2000-01-01T02:00:00.000Z'),
        availableDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        interval: 15,
    },
];

// Mock reservation data matching the new schema structure
const mockReservations = [
    {
        id: 'res_001',
        reservationId: 'NEVO-20250316-001',
        vehicleId: 'TESLA-M3-DUB-001',
        startDateTime: new Date('2024-03-16T09:00:00.000Z'),
        customerName: 'John Smith',
        customerEmail: 'john.smith@email.com',
        customerPhone: '+353851234567',
    },
    {
        id: 'res_002',
        reservationId: 'NEVO-20250316-002',
        vehicleId: 'TESLA-M3-DUB-002',
        startDateTime: new Date('2024-03-16T09:00:00.000Z'),
        customerName: "Sarah O'Connor",
        customerEmail: 'sarah.oconnor@email.com',
        customerPhone: '+353859876543',
    },
    {
        id: 'res_003',
        reservationId: 'NEVO-20250316-003',
        vehicleId: 'TESLA-M3-DUB-001',
        startDateTime: new Date('2024-03-16T11:30:00.000Z'),
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
                        id: vehicle.id,
                        vehicleId: vehicle.vehicleId,
                        type: vehicle.type,
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
                        id: reservation.id,
                        reservationId: reservation.reservationId,
                        vehicleId: reservation.vehicleId,
                        startDateTime: reservation.startDateTime,
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
