import { Exclude, Expose } from 'class-transformer';
import { Role } from '../../../common/constants/roles.constant';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  createdAt: Date;
}
