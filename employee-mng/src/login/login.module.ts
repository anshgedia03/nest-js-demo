import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RegisterModule } from '../register/register.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [AuthModule, RegisterModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
