import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ROLES, Role } from '../../../common/constants/roles.constant';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(ROLES)
  role?: Role;
}
