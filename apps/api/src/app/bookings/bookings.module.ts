import { Module } from '@nestjs/common';
import { ConfigModule } from '@nevo/config';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
    imports: [ConfigModule, VehiclesModule],
    providers: [BookingsService],
    controllers: [BookingsController],
    exports: [BookingsService],
})
export class BookingsModule {}
