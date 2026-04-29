import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterController } from './register.controller';
import { Register } from './register.entity';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([Register])],
  controllers: [RegisterController],
  providers: [RegisterService],
  exports: [TypeOrmModule, RegisterService],
})
export class RegisterModule {}
