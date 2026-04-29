import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInSeconds = Number(
          configService.get<string>('JWT_EXPIRES_IN_SECONDS') ?? '86400',
        );

        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  providers: [AuthGuard, RolesGuard],
  exports: [JwtModule, AuthGuard, RolesGuard],
})
export class AuthModule {}
