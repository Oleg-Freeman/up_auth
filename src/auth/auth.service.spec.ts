import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Types, model } from 'mongoose';
import { UserSchema } from './user.model';
import { ModelNames } from '../constants';
import { configService } from '../config';

describe('AuthService', () => {
  let service: AuthService;
  const UserModel = model(ModelNames.USER, UserSchema);
  const baseMockData = {
    _id: new Types.ObjectId('63700099188873cbe07dae2b'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockUserModel = {
    create: jest.fn((dto) => {
      return new UserModel({
        ...dto,
        ...baseMockData,
      });
    }),
    findOne: jest.fn(() => false),
    toObject: jest.fn((dto) => dto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: configService.getJwtSecret(),
          signOptions: { expiresIn: configService.getJwtExpiration() },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(ModelNames.USER),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
