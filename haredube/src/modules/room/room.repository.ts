import { Room } from '@models/meeting.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class RoomRepository extends BaseRepository<Room> {
  constructor(@InjectModel(Room.name) roomModel: Model<Room>) {
    super(roomModel);
  }
}
