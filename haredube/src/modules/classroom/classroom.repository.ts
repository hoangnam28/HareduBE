import { Classroom } from '@models/classroom.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class ClassroomRepository extends BaseRepository<Classroom> {
  constructor(@InjectModel(Classroom.name) classroomModel: Model<Classroom>) {
    super(classroomModel);
  }
}
