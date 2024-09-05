import { Roles } from '@common/constants/global.const';
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { GallerysRepository } from './gallery.repository';

@Injectable()
export class GalleryService {
  constructor(private gallerysRepository: GallerysRepository) {}

  generateFilename = (file: Express.Multer.File) => {
    file.originalname = file.originalname.replace(/(\.png|\.jpg|\.jpeg)$/, '.webp');
    const filename = `${Date.now()}-${file.originalname.replace(/[%#]/g, '')}`;
    return filename;
  };

  async createGallery(userId: string, role: Roles, images: Array<Express.Multer.File>) {
    const listGallery = await Promise.all(
      images.reverse().map(async (image) => {
        const fileName = this.generateFilename(image);
        await sharp(image.buffer, { animated: true }).toFile(`./public/images/upload/${fileName}`);

        return {
          imageUrl: `images/upload/${fileName}`,
          userId,
          role,
        };
      }),
    );

    return await this.gallerysRepository.createMany(listGallery);
  }
}
