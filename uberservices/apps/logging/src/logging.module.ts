import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingController } from './logging.controller';
import { LoggingService } from './logging.service';
import { Rider } from './rider/rider.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', ''),
        database: configService.get<string>('DB_NAME', 'postgres'),
        autoLoadEntities: true,
        synchronize:
          configService.get<string>('DB_SYNC', 'false') === 'true',
      }),
    }),
    TypeOrmModule.forFeature([Rider]),
    ClientsModule.registerAsync([
      {
        name: 'RIDER_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('RIDER_TCP_HOST', '127.0.0.1'),
            port: Number(configService.get<string>('RIDER_TCP_PORT', '4001')),
          },
        }),
      },
    ]),
  ],
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class LoggingModule {}
