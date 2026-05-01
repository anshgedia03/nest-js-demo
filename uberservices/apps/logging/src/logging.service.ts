import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AddressResponse, Coordinates } from './address/address.types';
import { CreateRiderDto } from './rider/dto/create-rider.dto';
import { Rider } from './rider/rider.entity';

type RiderWithAddress = Rider & AddressResponse;

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @Inject('RIDER_SERVICE')
    private readonly riderClient: ClientProxy,
    @Inject('ADDRESS_SERVICE')
    private readonly addressClient: ClientProxy,
  ) {}

  async createRider(createRiderDto: CreateRiderDto): Promise<Rider> {
    const rider = this.riderRepository.create(createRiderDto);

    return this.riderRepository.save(rider);
  }

  async getRiderById(id: number): Promise<RiderWithAddress | null> {
    const rider = await firstValueFrom(
      this.riderClient.send<Rider | null>({ cmd: 'get_rider' }, id),
    );

    if (!rider) {
      return null;
    }

    const coordinates: Coordinates = {
      lat: rider.lat,
      lon: rider.lon,
    };

    const address = await firstValueFrom(
      this.addressClient.send<AddressResponse>(
        { cmd: 'resolve_address' },
        coordinates,
      ),
    );

    return {
      ...rider,
      address: address.address,
    };
  }
}
