import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RewardsModule } from '../src/rewards/rewards.module';
import { RewardsService } from '../src/rewards/rewards.service';

describe('RewardsController (e2e)', () => {
  let app: INestApplication;
  let rewardsService = {
    getPoints: jest.fn().mockResolvedValue({ userId: 'u1', totalPoints: 100 }),
    getTransactions: jest.fn().mockResolvedValue([{ id: 1 }]),
    redeem: jest.fn().mockResolvedValue({ message: 'Redemption successful' }),
    getOptions: jest.fn().mockResolvedValue([{ name: 'Option1' }]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RewardsModule],
    })
      .overrideProvider(RewardsService)
      .useValue(rewardsService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  it('/rewards/points (GET)', () => {
    return request(app.getHttpServer())
      .get('/rewards/points?userId=u1')
      .expect(200)
      .expect({ userId: 'u1', totalPoints: 100 });
  });

  it('/rewards/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/rewards/transactions?userId=u1')
      .expect(200)
      .expect([{ id: 1 }]);
  });

  it('/rewards/redeem (POST)', () => {
    return request(app.getHttpServer())
      .post('/rewards/redeem')
      .send({ userId: 'u1', optionId: 'o1' })
      .expect(200)
      .expect({ message: 'Redemption successful' });
  });

  it('/rewards/options (GET)', () => {
    return request(app.getHttpServer())
      .get('/rewards/options')
      .expect(200)
      .expect([{ name: 'Option1' }]);
  });

  afterAll(async () => {
    await app.close();
  });
}); 