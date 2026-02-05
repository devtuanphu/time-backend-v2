import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ZaloService } from './zalo.service';
import { ZaloController } from './zalo.controller';
import { ZaloToken } from './entities/zalo-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZaloToken]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [ZaloController],
  providers: [ZaloService],
  exports: [ZaloService],
})
export class ZaloModule {}
