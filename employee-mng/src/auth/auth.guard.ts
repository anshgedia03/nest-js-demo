import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RegisterRole } from '../register/register-role.enum';

type AuthenticatedRequest = Request & {
  user?: {
    email: string;
    role: RegisterRole;
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        email: string;
        role: RegisterRole;
      }>(token);

      request.user = {
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return null;
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}
