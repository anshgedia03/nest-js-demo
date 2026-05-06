import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANTS } from '../../../common/constants/jwt.constant';
import { JwtPayloadType } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(JWT_CONSTANTS.CONFIG_SECRET_PATH),
    });
  }

  // Expose a narrow, typed user object on request.user for guards/controllers.
  validate(payload: JwtPayloadType): JwtPayloadType {
    return payload;
  }
}
