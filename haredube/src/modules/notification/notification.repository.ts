import { Notification } from '@models/notification.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class NotifyRepository extends BaseRepository<Notification> {
  constructor(@InjectModel(Notification.name) classroomModel: Model<Notification>) {
    super(classroomModel);
  }
}
