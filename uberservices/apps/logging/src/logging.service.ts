import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateRiderDto } from './rider/dto/create-rider.dto';
import { Rider } from './rider/rider.entity';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @Inject('RIDER_SERVICE')
    private readonly riderClient: ClientProxy,
  ) {}

  async createRider(createRiderDto: CreateRiderDto): Promise<Rider> {
    const rider = this.riderRepository.create(createRiderDto);

    return this.riderRepository.save(rider);
  }

  async getRiderById(id: number): Promise<Rider | null> {
    return firstValueFrom(
      this.riderClient.send<Rider | null>({ cmd: 'get_rider' }, id),
    );
  }
}
