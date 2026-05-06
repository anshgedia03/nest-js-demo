import { Request } from 'express';
import { JwtPayloadType } from '../../modules/auth/types/jwt-payload.type';

export interface RequestWithUser extends Request {
  user: JwtPayloadType;
}
