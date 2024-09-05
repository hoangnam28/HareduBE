import { ResponseType } from '@common/constants/global.const';
import { Profile } from '@common/decorators/user.decorator';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { Gallery } from '@models/gallery.model';
import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { ApiListResponse } from './../../common/decorators/api-response/api-list-response.decorator';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from '@common/interfaces/gallery.model';

const imageFileFilter = (req: any, file: any, callback: (error: Error, acceptFile: boolean) => void) => {
  const allowedExtensions = ['.png', '.jpg', '.gif', '.jpeg', '.webp'];
  const ext = extname(file.originalname).toLowerCase();
  callback(null, allowedExtensions.includes(ext));
};

const multerOptionsImage: MulterOptions = {
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 52428800, //20MB
  },
};

@Controller('galleries')
@ApiTags('Gallery')
@ApiBearerAuth()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('images', Number.POSITIVE_INFINITY, multerOptionsImage))
  @ApiListResponse(Gallery, ResponseType.Created)
  @ApiBody({ type: CreateGalleryDto })
  @ApiConsumes('multipart/form-data')
  createAdmin(@Profile() { userId, role }: JwtTokenDecrypted, @UploadedFiles() images: Array<Express.Multer.File>) {
    return this.galleryService.createGallery(userId, role, images);
  }
}
