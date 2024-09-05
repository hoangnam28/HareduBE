import { NotifyUser } from '@models/notifyUser.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class NotifyUserRepository extends BaseRepository<NotifyUser> {
  constructor(@InjectModel(NotifyUser.name) classroomModel: Model<NotifyUser>) {
    super(classroomModel);
  }
}
