import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
    providers: [VehiclesService],
    controllers: [VehiclesController],
    exports: [VehiclesService],
})
export class VehiclesModule {}
