import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserProducerController } from './user_producer.controller';
import { USER_LOGIN_CLIENT, UserProducerService } from './user_producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_LOGIN_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE ?? 'user_login_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [UserProducerController],
  providers: [UserProducerService],
})
export class UserProducerModule {}
