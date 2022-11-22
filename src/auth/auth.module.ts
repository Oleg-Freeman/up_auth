import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { ModelNames } from '../constants';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.USER, schema: UserSchema }]),
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: configService.getJwtExpiration() },
    }),
  ],
})
export class AuthModule {}
