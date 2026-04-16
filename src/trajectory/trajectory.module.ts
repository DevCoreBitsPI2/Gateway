import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { CareerHistoryController } from './career-history/career-history.controller';
import { PerformanceEvaluationController } from './performance-evaluation/performance-evaluation.controller';

@Module({
  controllers: [CareerHistoryController, PerformanceEvaluationController],
  imports: [
    NatsModule,
  ]
})
export class TrajectoryModule {}
