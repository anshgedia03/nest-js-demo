import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
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
  ],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
