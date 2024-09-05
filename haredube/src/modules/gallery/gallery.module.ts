import { Gallery, GallerySchema } from '@models/gallery.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GallerysRepository } from './gallery.repository';
import { GalleryService } from './gallery.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }])],
  controllers: [GalleryController],
  providers: [GalleryService, GallerysRepository],
})
export class GalleryModule {}
