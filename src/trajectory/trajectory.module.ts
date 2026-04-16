import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { CareerHistoryController } from './career-history/career-history.controller';

@Module({
  controllers: [CareerHistoryController, ],
  imports: [
    NatsModule,
  ]
})
export class TrajectoryModule {}
