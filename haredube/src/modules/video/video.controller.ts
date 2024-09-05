import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DemoVideoService } from './video.service';
import { Profile } from '@common/decorators/user.decorator';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

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

@Controller('videos')
@ApiTags('videos')
export class DemoVideoController {
  constructor(private readonly DemoVideoService: DemoVideoService) {}

  @Get('')
  getAll(@Query('search') search: string) {
    return this.DemoVideoService.getAll(search);
  }

  @Get('my-video')
  getMyVideo(@Profile() { userId }: JwtTokenDecrypted) {
    return this.DemoVideoService.getMyVideo(userId);
  }

  @Get('user-video/:slug')
  getUserVideo(@Param('slug') slug: string) {
    return this.DemoVideoService.getUserVideo(slug);
  }

  @Get(':id')
  getOneVideo(@Param('id') id: string) {
    return this.DemoVideoService.getOneVideo(id);
  }

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('file', Number.POSITIVE_INFINITY, {
      fileFilter: (req: any, file: any, callback: (error: Error, acceptFile: boolean) => void) => {
        const allowedExtensions = ['.mp4'];
        const ext = extname(file.originalname).toLowerCase();
        callback(null, allowedExtensions.includes(ext));
      },
      limits: {
        fileSize: 52428800, //20MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  updateCv(@Profile() { userId }: JwtTokenDecrypted, @UploadedFiles() video: Array<Express.Multer.File>) {
    return this.DemoVideoService.create(userId, video[0]);
  }

  @Delete(':id')
  delete(@Profile() { userId }: JwtTokenDecrypted, @Param('id') id: string) {
    return this.DemoVideoService.delete(userId, id);
  }

  @Post(':id/upload-thumbnail')
  @UseInterceptors(FilesInterceptor('file', Number.POSITIVE_INFINITY, multerOptionsImage))
  @ApiConsumes('multipart/form-data')
  uploadAvatar(@Param('id') id: string, @UploadedFiles() thumbnail: Array<Express.Multer.File>) {
    return this.DemoVideoService.uploadThumnail(id, thumbnail[0]);
  }

  @Put(':id')
  update(@Profile() { userId }: JwtTokenDecrypted, @Param('id') id: string, @Body() data: any) {
    return this.DemoVideoService.update(userId, id, data);
  }
}
