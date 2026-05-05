import { Injectable, Logger } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  handleMessage(eventName: string, payload: Record<string, unknown>, context: MqttContext) {
    const topic = context.getTopic();
    const packet = context.getPacket();

    const result = {
      eventName,
      topic,
      qos: packet.qos ?? 0,
      duplicate: packet.dup ?? false,
      retain: packet.retain ?? false,
      payload,
    };

    this.logger.log(
      `Consumed ${eventName} from ${topic} with QoS ${result.qos}: ${JSON.stringify(payload)}`,
    );
    this.logger.debug(`MQTT packet metadata: ${JSON.stringify(packet)}`);

    return result;
  }
}
