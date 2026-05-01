import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Rider } from './rider/rider.entity';
import { RiderService } from './rider.service';

@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Get(':id')
  async getRiderById(@Param('id', ParseIntPipe) id: number): Promise<Rider> {
    const rider = await this.riderService.getRiderById(id);

    if (!rider) {
      throw new NotFoundException(`Rider with id ${id} not found`);
    }

    return rider;
  }

  @MessagePattern({ cmd: 'get_rider' })
  getRiderMessage(@Payload() id: number): Promise<Rider | null> {
    return this.riderService.getRiderById(id);
  }
}
