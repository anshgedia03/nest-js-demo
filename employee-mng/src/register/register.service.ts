import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegisterDto } from './dto/create-register.dto';
import { Register } from './register.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private readonly registerRepository: Repository<Register>,
  ) {}

  async create(
    createRegisterDto: CreateRegisterDto,
  ): Promise<Omit<Register, 'password'>> {
    const existingRecord = await this.registerRepository.findOneBy({
      email: createRegisterDto.email,
    });

    if (existingRecord) {
      throw new ConflictException('A register record with this email already exists');
    }

    const registerRecord = this.registerRepository.create({
      email: createRegisterDto.email,
      password: this.hashPassword(createRegisterDto.password),
      role: createRegisterDto.role,
    });

    const savedRecord = await this.registerRepository.save(registerRecord);

    return this.stripPassword(savedRecord);
  }

  async findAll(): Promise<Array<Omit<Register, 'password'>>> {
    const records = await this.registerRepository.find({
      order: {
        id: 'ASC',
      },
    });

    return records.map((record) => this.stripPassword(record));
  }

  async findById(id: number): Promise<Omit<Register, 'password'>> {
    const record = await this.registerRepository.findOneBy({ id });

    if (!record) {
      throw new NotFoundException(`Register record with id ${id} was not found`);
    }

    return this.stripPassword(record);
  }

  async findByEmail(email: string): Promise<Register | null> {
    return this.registerRepository
      .createQueryBuilder('register')
      .addSelect('register.password')
      .where('register.email = :email', { email })
      .getOne();
  }

  verifyPassword(plainTextPassword: string, hashedPassword: string): boolean {
    const [salt, storedHash] = hashedPassword.split(':');

    if (!salt || !storedHash) {
      return false;
    }

    const incomingHash = createHash('sha256')
      .update(`${salt}:${plainTextPassword}`)
      .digest('hex');

    if (storedHash.length !== incomingHash.length) {
      return false;
    }

    return timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(incomingHash, 'hex'),
    );
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex');

    return `${salt}:${hash}`;
  }

  private stripPassword(registerRecord: Register): Omit<Register, 'password'> {
    const { password: _password, ...safeRecord } = registerRecord;

    return safeRecord;
  }
}
