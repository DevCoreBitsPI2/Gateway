import { Module } from '@nestjs/common';
import { NatsModule } from '@/src/transports/nats.module';
import { AreasController } from './areas/areas.controller';
import { PositionsController } from './positions/positions.controller';
import { ContractsController } from './contracts/contracts.controller';

@Module({
  imports: [NatsModule],
  controllers: [AreasController, PositionsController, ContractsController],
})
export class AdministrativeDataModule {}
