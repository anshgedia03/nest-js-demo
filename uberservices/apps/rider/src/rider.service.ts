import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rider } from './rider/rider.entity';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
  ) {}

  async getRiderById(id: number): Promise<Rider | null> {
    return this.riderRepository.findOne({
      where: { id },
    });
  }
}
