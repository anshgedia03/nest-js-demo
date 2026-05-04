import { Body, Controller, Post } from '@nestjs/common';
import { UserProducerService } from './user_producer.service';

interface user {
  email: string;
  password: string;
}

@Controller()
export class UserProducerController {
  constructor(private readonly userProducerService: UserProducerService) {}

  @Post('login')
  login(@Body() body:user ) {
    return this.userProducerService.login(body);
  }
}
