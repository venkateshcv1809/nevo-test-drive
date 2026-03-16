import { Module } from '@nestjs/common';
import { ConfigService } from '@nevo/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesService } from './vehicles/vehicles.service';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';

@Module({
    providers: [AppService, VehiclesService, BookingsService, ConfigService],
    controllers: [AppController, VehiclesController, BookingsController],
})
export class AppModule {}
