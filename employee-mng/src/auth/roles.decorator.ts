import { SetMetadata } from '@nestjs/common';
import { RegisterRole } from '../register/register-role.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RegisterRole[]) => SetMetadata(ROLES_KEY, roles);
