import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { NatsModule } from '@/src/transports/nats.module';

@Module({
  controllers: [AdminController],
  providers: [],
  imports: [
    NatsModule
  ]

})
export class AdminModule {}
