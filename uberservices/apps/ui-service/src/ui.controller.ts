import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { UiService } from './ui.service';

type RiderLookupViewModel = {
  error: string | null;
  rider: {
    id: number;
    name: string;
    lat: number;
    lon: number;
    address: string | null;
    mapEmbedUrl: string;
    mapLinkUrl: string;
  } | null;
  riderId: string;
};

@Controller()
export class UiController {
  constructor(private readonly uiService: UiService) {}

  @Get()
  @Render('index')
  getHome(): RiderLookupViewModel {
    return {
      error: null,
      rider: null,
      riderId: '',
    };
  }

  @Post('search')
  @Render('index')
  async searchRider(
    @Body('riderId') riderId: string,
  ): Promise<RiderLookupViewModel> {
    const parsedId = Number(riderId);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return {
        error: 'Please enter a valid rider ID.',
        rider: null,
        riderId,
      };
    }

    const result = await this.uiService.findRider(parsedId);

    if (!result) {
      return {
        error: `Rider with ID ${parsedId} was not found.`,
        rider: null,
        riderId,
      };
    }

    return {
      error: null,
      rider: {
        ...result,
        mapEmbedUrl: this.buildMapEmbedUrl(result.lat, result.lon),
        mapLinkUrl: this.buildMapLinkUrl(result.lat, result.lon),
      },
      riderId,
    };
  }

  private buildMapEmbedUrl(lat: number, lon: number): string {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const top = lat + delta;
    const bottom = lat - delta;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
  }

  private buildMapLinkUrl(lat: number, lon: number): string {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;
  }
}
