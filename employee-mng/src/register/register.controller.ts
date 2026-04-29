import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { Register } from './register.entity';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(
    @Body() createRegisterDto: CreateRegisterDto,
  ): Promise<Omit<Register, 'password'>> {
    return this.registerService.create(createRegisterDto);
  }

  @Get()
  findAll(): Promise<Array<Omit<Register, 'password'>>> {
    return this.registerService.findAll();
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<Register, 'password'>> {
    return this.registerService.findById(id);
  }
}
