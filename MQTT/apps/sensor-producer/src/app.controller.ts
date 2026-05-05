import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type {
  FireAlertPayload,
  SensorStatusPayload,
  SmokePayload,
  TemperaturePayload,
} from './types/sensor.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProjectInfo() {
    return this.appService.getProjectInfo();
  }

  @Post('sensors/temperature')
  publishTemperature(@Body() payload: TemperaturePayload) {
    return this.appService.publishTemperature(payload);
  }

  @Post('sensors/smoke')
  publishSmoke(@Body() payload: SmokePayload) {
    return this.appService.publishSmoke(payload);
  }

  @Post('sensors/fire-alert')
  publishFireAlert(@Body() payload: FireAlertPayload) {
    return this.appService.publishFireAlert(payload);
  }

  @Post('sensors/:sensorId/status')
  publishSensorStatus(
    @Param('sensorId') sensorId: string,
    @Body() payload: SensorStatusPayload,
  ) {
    return this.appService.publishSensorStatus(sensorId, payload);
  }
}
