import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config';
import { AuthModule } from './auth';

@Module({
  imports: [
    MongooseModule.forRoot(configService.getMongoDbConfig()),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
