import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Gateway')
  const app = await NestFactory.create(AppModule);
  
  //TODO: cors

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  });
  
  await app.startAllMicroservices();
  await app.listen(envs.port || 3000);

  logger.log(`HTTP Server en http://localhost:${envs.port || 3000}`);
  logger.log(` NATS conectado`);
}
bootstrap();
