import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EmailConsumerModule } from './../src/email_consumer.module';

describe('EmailConsumerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmailConsumerModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should bootstrap the module', () => {
    expect(app).toBeDefined();
  });
});
