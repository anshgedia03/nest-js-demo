import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RiderModule } from './rider.module';

async function bootstrap() {
  const app = await NestFactory.create(RiderModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.RIDER_TCP_HOST ?? '127.0.0.1',
      port: Number(process.env.RIDER_TCP_PORT ?? 4001),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
