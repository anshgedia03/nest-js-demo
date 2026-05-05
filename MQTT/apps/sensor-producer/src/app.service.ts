import {Inject,Injectable,Logger,OnModuleDestroy,OnModuleInit,} from '@nestjs/common';
import {ClientProxy,MqttRecordBuilder,MqttStatus,} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import type {FireAlertPayload,SensorStatusPayload,SmokePayload,TemperaturePayload} from './types/sensor.types';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppService.name);

constructor(
    @Inject('WAREHOUSE_MQTT_CLIENT') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    this.client.status.subscribe((status: MqttStatus) => {
      this.logger.log(`MQTT client status: ${status}`);
    });

    const mqttClient = this.client as any;
    mqttClient.on('error', (error: Error) => {
      this.logger.error(`MQTT client error: ${error.message}`, error.stack);
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getProjectInfo() {
    return {
      service: 'sensor-producer',
      transport: 'HTTP -> MQTT',
      topics: {
        normal: 'warehouse/temperature',
        alert: 'warehouse/smoke',
        critical: 'warehouse/fire-alert',
        wildcardExample: 'warehouse/{sensorId}/status',
      },
    };
  }

  async publishTemperature(payload: TemperaturePayload) {
    return this.publish('warehouse/temperature', payload, 0);
  }

  async publishSmoke(payload: SmokePayload) {
    return this.publish('warehouse/smoke', payload, 1);
  }

  async publishFireAlert(payload: FireAlertPayload) {
    return this.publish('warehouse/fire-alert', payload, 2);
  }

  async publishSensorStatus(sensorId: string, payload: SensorStatusPayload) {
    return this.publish(`warehouse/${sensorId}/status`, payload, 0);
  }

  private async publish(
    topic: string,
    payload: Record<string, unknown>,
    qos: 0 | 1 | 2,
  ) {
    const record = new MqttRecordBuilder(payload).setQoS(qos).build();

    await lastValueFrom(this.client.emit(topic, record));

    this.logger.log(`Published MQTT event to ${topic} with QoS ${qos}`);

    return {
      topic,
      qos,
      payload,
    };
  }
}
