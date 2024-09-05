import { TeachingFiled } from '@models/teaching-filed.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class TeachingFiledRepository extends BaseRepository<TeachingFiled> {
  constructor(@InjectModel(TeachingFiled.name) teachingFieldModel: Model<TeachingFiled>) {
    super(teachingFieldModel);
  }
}
