import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddressResponseDto, CoordinatesDto } from './address/address.types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<AddressResponseDto> {
    return this.appService.resolveAddress({ lat: 0, lon: 0 });
  }

  @Post('address')
  resolveAddress(
    @Body() coordinates: CoordinatesDto,
  ): Promise<AddressResponseDto> {
    return this.appService.resolveAddress(coordinates);
  }

  @MessagePattern({ cmd: 'resolve_address' })
  resolveAddressMessage(
    @Payload() coordinates: CoordinatesDto,
  ): Promise<AddressResponseDto> {
    return this.appService.resolveAddress(coordinates);
  }
}
