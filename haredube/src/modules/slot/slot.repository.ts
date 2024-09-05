import { Slot } from '@models/slot.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class SlotRepository extends BaseRepository<Slot> {
  constructor(@InjectModel(Slot.name) slotModel: Model<Slot>) {
    super(slotModel);
  }
}
