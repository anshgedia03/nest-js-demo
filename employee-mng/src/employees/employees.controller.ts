import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RegisterRole } from '../register/register-role.enum';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './employee.entity';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RegisterRole.ADMIN)
  create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Employee> {
    return this.employeesService.findById(id);
  }
}
