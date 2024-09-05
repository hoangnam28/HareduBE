import { Gallery } from '@models/gallery.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base/base.repository';

@Injectable()
export class GallerysRepository extends BaseRepository<Gallery> {
  constructor(@InjectModel(Gallery.name) galleryModel: Model<Gallery>) {
    super(galleryModel);
  }
}
