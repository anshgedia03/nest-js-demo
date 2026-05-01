import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { LoggingModule } from './../src/logging.module';

describe.skip('LoggingController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LoggingModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/riders/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/riders/1')
      .expect(404);
  });
});
