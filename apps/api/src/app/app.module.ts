import { Module } from '@nestjs/common';
import { ConfigService } from '@nevo/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsController } from './bookings/bookings.controller';
import { BookingsService } from './bookings/bookings.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PrismaModule } from '@nevo/prisma';
import { LoggerModule } from '@nevo/logger';

@Module({
    imports: [PrismaModule, LoggerModule, VehiclesModule],
    providers: [AppService, BookingsService, ConfigService],
    controllers: [AppController, BookingsController],
})
export class AppModule {}
