import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Register } from './register.entity';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: getRepositoryToken(Register),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
