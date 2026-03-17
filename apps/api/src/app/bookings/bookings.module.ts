import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
    imports: [VehiclesModule],
    providers: [BookingsService],
    controllers: [BookingsController],
    exports: [BookingsService],
})
export class BookingsModule {}
