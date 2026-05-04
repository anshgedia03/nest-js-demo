import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface User {
  name: string;
  email: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface UserLoggedInEvent {
  name: string;
  email: string;
  loggedInAt: string;
}

export const USER_LOGIN_CLIENT = 'USER_LOGIN_CLIENT';

const dummyUsers: User[] = [
  {
    name: 'ansh gedia',
    email: 'anshgedia03@gmail.com',
    password: '123456',
  },
];

@Injectable()
export class UserProducerService {
  constructor(
    @Inject(USER_LOGIN_CLIENT) private readonly client: ClientProxy,
  ) {}

  async login(body: LoginDto) {
    const user = dummyUsers.find(
      (candidate) =>
        candidate.email === body.email && candidate.password === body.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const eventPayload: UserLoggedInEvent = {
      name: user.name,
      email: user.email,
      loggedInAt: new Date().toISOString(),
    };

    await firstValueFrom(this.client.emit('user.logged_in', eventPayload));

    return {
      message: 'Login successful. Welcome email queued.',
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }
}
