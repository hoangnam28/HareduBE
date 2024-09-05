import { DemoVideo } from '@models/demo-video.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class DemoVideoRepository extends BaseRepository<DemoVideo> {
  constructor(@InjectModel(DemoVideo.name) teachingFieldModel: Model<DemoVideo>) {
    super(teachingFieldModel);
  }
}
