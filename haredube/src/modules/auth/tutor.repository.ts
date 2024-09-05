import { Tutor } from '@models/tutor.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class TutorRepository extends BaseRepository<Tutor> {
  constructor(@InjectModel(Tutor.name) tutorModel: Model<Tutor>) {
    super(tutorModel);
  }
}
