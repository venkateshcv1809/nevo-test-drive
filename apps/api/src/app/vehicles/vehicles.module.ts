import { Module } from '@nestjs/common';
import { ConfigModule } from '@nevo/config';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
    imports: [ConfigModule],
    providers: [VehiclesService],
    controllers: [VehiclesController],
    exports: [VehiclesService],
})
export class VehiclesModule {}
