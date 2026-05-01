import { Injectable, Logger } from '@nestjs/common';
import { AddressResponseDto, CoordinatesDto } from './address/address.types';

type NominatimReverseResponse = {
  display_name?: string;
  error?: string;
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async resolveAddress({
    lat,
    lon,
  }: CoordinatesDto): Promise<AddressResponseDto> {
    const baseUrl =
      process.env.GEOCODER_BASE_URL ?? 'https://geocode.maps.co/reverse';
    const apiKey = process.env.GEOCODER_API_KEY;

    const url = new URL(baseUrl);
    url.searchParams.set('format', 'json');
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('accept-language', 'en');

    if (!apiKey) {
      this.logger.warn('GEOCODER_API_KEY is missing; address lookup skipped');
      return {
        address: null,
      };
    }

    url.searchParams.set('api_key', apiKey);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        this.logger.warn(
          `Reverse geocoding failed for ${lat},${lon} with status ${response.status}`,
        );
        return {
          address: null,
        };
      }

      const result = (await response.json()) as NominatimReverseResponse;

      if (!result.display_name) {
        this.logger.warn(
          `Reverse geocoding returned no address for ${lat},${lon}: ${result.error ?? 'unknown error'}`,
        );
        return {
          address: null,
        };
      }

      return {
        address: result.display_name,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown geocoding error';
      this.logger.error(
        `Reverse geocoding request failed for ${lat},${lon}: ${message}`,
      );
      return {
        address: null,
      };
    }
  }
}
