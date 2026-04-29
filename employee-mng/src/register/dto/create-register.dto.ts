import { RegisterRole } from '../register-role.enum';

export class CreateRegisterDto {
  email: string;
  password: string;
  role: RegisterRole;
}
