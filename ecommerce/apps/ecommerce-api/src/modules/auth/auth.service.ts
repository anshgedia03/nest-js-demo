import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MESSAGES } from '../../common/constants/messages.constant';
import { ROLES, Role } from '../../common/constants/roles.constant';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    await this.ensureEmailIsAvailable(registerDto.email);

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role ?? ROLES.USER,
    });

    return this.usersService.toResponseDto(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return {
      accessToken: await this.generateAccessToken(user.id, user.email, user.role),
    };
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    await this.usersService.ensureEmailIsAvailable(email);
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    role: Role,
  ): Promise<string> {
    const payload: JwtPayloadType = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.signAsync(payload);
  }
}
