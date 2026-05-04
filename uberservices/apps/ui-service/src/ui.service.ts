import { Injectable, Logger } from '@nestjs/common';

type LoggingRiderResponse = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  address: string | null;
};

@Injectable()
export class UiService {
  private readonly logger = new Logger(UiService.name);

  async findRider(id: number): Promise<LoggingRiderResponse | null> {
    const baseUrl = process.env.LOGGING_BASE_URL ?? 'http://127.0.0.1:5000';

    try {
      const response = await fetch(`${baseUrl}/riders/${id}`, {
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        this.logger.warn(
          `Logging service returned status ${response.status} for rider ${id}`,
        );
        return null;
      }

      const rider = (await response.json()) as LoggingRiderResponse;

      return {
        id: rider.id,
        name: rider.name,
        lat: rider.lat,
        lon: rider.lon,
        address: rider.address,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown UI lookup error';
      this.logger.error(`Failed to fetch rider ${id}: ${message}`);
      return null;
    }
  }
}
