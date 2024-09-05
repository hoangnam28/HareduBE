import { Module } from '@nestjs/common';
import { TeachingFiledService } from './teaching-filed.service';
import { TeachingFiledController } from './teaching-filed.controller';
import { TeachingFiled, TeachingFiledSchema } from '@models/teaching-filed.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachingFiledRepository } from './teaching-filed.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: TeachingFiled.name, schema: TeachingFiledSchema }])],
  controllers: [TeachingFiledController],
  providers: [TeachingFiledService, TeachingFiledRepository],
  exports: [TeachingFiledService, TeachingFiledRepository],
})
export class TeachingFiledModule {}
