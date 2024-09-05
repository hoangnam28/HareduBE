import { Module } from '@nestjs/common';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Demo, DemoSchema } from '@models/demo.model';
import { DemoRepository } from './demo.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Demo.name, schema: DemoSchema }])],
  controllers: [DemoController],
  providers: [DemoRepository, DemoService],
  exports: [DemoRepository, DemoService],
})
export class DemoModule {}
