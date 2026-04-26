import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';

async function bootstrap() {
  const logger = new Logger('Gateway')
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'https://www.devcorebits.com',
      'https://devcorebits.com',
      'http://localhost:5173',
      'http://localhost:3005',
      'http://localhost:3006',
      'https://admin.devcorebits.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  app.setGlobalPrefix('api', {
    exclude:[{
      path: '',
      method: RequestMethod.GET
    }]
  });

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
      maxPayload: 20971520,
    },
  });
  
  await app.startAllMicroservices();
  await app.listen(envs.port || 3000);

  logger.log(`HTTP Server en http://localhost:${envs.port || 3000}`);
  logger.log(` NATS conectado`);
}
bootstrap();
