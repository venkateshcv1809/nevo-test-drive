import { Module } from '@nestjs/common';
import { ConfigService } from '@nevo/config';
import { LoggerModule } from '@nevo/logger';
import { PrismaModule } from '@nevo/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
    imports: [PrismaModule, LoggerModule, VehiclesModule, BookingsModule],
    providers: [AppService, ConfigService],
    controllers: [AppController],
})
export class AppModule {}
