import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesService } from './vehicles/vehicles.service';

@Module({
    providers: [AppService, VehiclesService],
    controllers: [AppController, VehiclesController],
})
export class AppModule {}
