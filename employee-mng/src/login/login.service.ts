import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterService } from '../register/register.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly registerService: RegisterService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const registerRecord = await this.registerService.findByEmail(loginDto.email);

    if (!registerRecord) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = this.registerService.verifyPassword(
      loginDto.password,
      registerRecord.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      email: registerRecord.email,
      role: registerRecord.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
