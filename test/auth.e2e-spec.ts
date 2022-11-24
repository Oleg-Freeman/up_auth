import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getModelToken } from '@nestjs/mongoose';
import { model, Types } from 'mongoose';
import { configService } from '../src/config';
import { ModelNames } from '../src/constants';
import { AuthModule, UserSchema } from '../src/auth';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const UserModel = model(ModelNames.USER, UserSchema);
  const baseMockData = {
    _id: new Types.ObjectId('63700099188873cbe07dae2b'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const testUserData = {
    name: 'Test',
    id: '+380973011034',
  };
  const baseOutput = {
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  };
  const mockUserModel = {
    findOne: jest.fn(() => false),
    create: jest.fn((dto) => {
      return new UserModel({
        ...dto,
        ...baseMockData,
      });
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getModelToken(ModelNames.USER))
      .useValue(mockUserModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app
      .useGlobalPipes(new ValidationPipe(configService.getValidationOptions()))
      .init();
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        ...testUserData,
        password: '12345678aA.',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          ...testUserData,
          ...baseOutput,
        });
      });
  }, 20000);
});
