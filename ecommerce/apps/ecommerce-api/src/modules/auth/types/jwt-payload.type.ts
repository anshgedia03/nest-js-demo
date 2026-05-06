import { Role } from '../../../common/constants/roles.constant';

export interface JwtPayloadType {
  sub: string;
  email: string;
  role: Role;
}
