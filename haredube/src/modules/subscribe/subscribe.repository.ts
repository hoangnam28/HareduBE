import { Subscriber } from '@models/subscribe.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class SubscribeRepository extends BaseRepository<Subscriber> {
  constructor(@InjectModel(Subscriber.name) classroomModel: Model<Subscriber>) {
    super(classroomModel);
  }
}
