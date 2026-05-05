import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  MqttStatus,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_URL ?? 'mqtt://localhost:1883',
        clientId:
          process.env.MQTT_CONSUMER_ID ?? 'warehouse-consumer-service',
        subscribeOptions: {
          qos: 0,
        },
      },
    },
  );

  app.status.subscribe((status: MqttStatus) => {
    console.log(`Warehouse Consumer MQTT server status: ${status}`);
  });

  const mqttServer = app as any;
  mqttServer.on('error', (error: Error) => {
    console.error(`Warehouse Consumer MQTT server error: ${error.message}`);
  });

  await app.listen();
  console.log('Warehouse Consumer Service is listening for MQTT messages');
}
bootstrap();
