import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [TypeOrmModule, EmployeesService],
})
export class EmployeesModule {}
