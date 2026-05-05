import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern('warehouse/temperature', { extras: { qos: 0 } })
  handleTemperature(
    @Payload() payload: Record<string, unknown>,
    @Ctx() context: MqttContext,
  ) {
    return this.appService.handleMessage('temperature', payload, context);
  }

  @EventPattern('warehouse/smoke', { extras: { qos: 1 } })
  handleSmoke(
    @Payload() payload: Record<string, unknown>,
    @Ctx() context: MqttContext,
  ) {
    return this.appService.handleMessage('smoke-alert', payload, context);
  }

  @EventPattern('warehouse/fire-alert', { extras: { qos: 2 } })
  handleFireAlert(
    @Payload() payload: Record<string, unknown>,
    @Ctx() context: MqttContext,
  ) {
    return this.appService.handleMessage('fire-alert', payload, context);
  }

  @EventPattern('warehouse/+/status', { extras: { qos: 0 } })
  handleStatusUpdate(
    @Payload() payload: Record<string, unknown>,
    @Ctx() context: MqttContext,
  ) {
    const topic = context.getTopic();
    this.logger.log(`Wildcard subscription matched topic: ${topic}`);
    return this.appService.handleMessage('device-status', payload, context);
  }
}
