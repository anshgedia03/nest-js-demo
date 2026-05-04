import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserProducerModule } from './../src/user_producer.module';
import { UserProducerService } from './../src/user_producer.service';

describe('UserProducerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserProducerModule],
    })
      .overrideProvider(UserProducerService)
      .useValue({
        login: jest.fn().mockResolvedValue({
          message: 'Login successful. Welcome email queued.',
          user: {
            name: 'ansh gedia',
            email: 'anshgedia03@gmail.com',
          },
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({
        email: 'anshgedia03@gmail.com',
        password: '123456',
      })
      .expect(201)
      .expect({
        message: 'Login successful. Welcome email queued.',
        user: {
          name: 'ansh gedia',
          email: 'anshgedia03@gmail.com',
        },
      });
  });
});
