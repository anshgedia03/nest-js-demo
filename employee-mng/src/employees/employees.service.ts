import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeesRepository.create(createEmployeeDto);

    return this.employeesRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findById(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOneBy({ id });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} was not found`);
    }

    return employee;
  }
}
