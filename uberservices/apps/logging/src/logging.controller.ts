import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { CreateRiderDto } from './rider/dto/create-rider.dto';
import { Rider } from './rider/rider.entity';

@Controller('riders')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Post()
  createRider(@Body() createRiderDto: CreateRiderDto): Promise<Rider> {
    return this.loggingService.createRider(createRiderDto);
  }

  @Get(':id')
  async getRiderById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Rider> {
    const rider = await this.loggingService.getRiderById(id);

    if (!rider) {
      throw new NotFoundException(`Rider with id ${id} not found`);
    }

    return rider;
  }
}
