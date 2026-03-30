import { Module } from '@nestjs/common';
import { AdministrativeDataController } from './administrative-data.controller';
import {ClientsModule} from '@nestjs/microservices'
import { NatsModule } from 'src/transports/nats.module';
@Module({
  controllers: [AdministrativeDataController],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class AdministrativeDataModule {}
