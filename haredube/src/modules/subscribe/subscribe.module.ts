import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { Subscriber, SubscriberSchema } from '@models/subscribe.model';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeRepository } from './subscribe.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }])],
  controllers: [SubscribeController],
  providers: [SubscribeService, SubscribeRepository],
  exports: [SubscribeService, SubscribeRepository],
})
export class SubscribeModule {}
