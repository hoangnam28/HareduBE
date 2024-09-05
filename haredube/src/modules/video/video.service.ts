import { Injectable } from '@nestjs/common';
import { DemoVideoRepository } from './video.repository';
import { Pagination, PaginationResult } from '@common/interfaces/filter.interface';
import { DemoVideo } from '@models/demo-video.model';
import * as fs from 'fs';
import * as path from 'path';
import { TeachingFiledRepository } from '@modules/teaching-filed/teaching-filed.repository';
import { DEFAULT_PLACEHODER } from '@common/constants/global.const';
import * as iconv from 'iconv-lite';
import { TutorRepository } from '@modules/auth/tutor.repository';
import { UsersRepository } from '@modules/user/user.repository';

@Injectable()
export class DemoVideoService {
  constructor(
    private demoVideoRepository: DemoVideoRepository,
    private teachingFiledRepository: TeachingFiledRepository,
    private tutorRepository: TutorRepository,
    private userRepository: UsersRepository,
  ) {}

  generateFilename = (file: Express.Multer.File) => {
    file.originalname = file.originalname.replace(/(\.png|\.jpg|\.jpeg)$/, '.webp');
    const filename = `${Date.now()}-${file.originalname.replace(/[%# ]/g, '')}`;
    return filename;
  };

  async getAll(search: string) {
    return this.demoVideoRepository.findAll(
      {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { 'userId.name': { $regex: search, $options: 'i' } },
          { 'teachingFiledId.name': { $regex: search, $options: 'i' } },
        ],
      },
      ['userId', 'teachingFiledId'],
    );
  }

  async getOneVideo(id: string) {
    const video = await this.demoVideoRepository.findById(id, ['userId', 'teachingFiledId']);
    const relateVideoList = await this.demoVideoRepository.findAll(
      {
        $and: [
          { $or: [{ teachingFiledId: video.teachingFiledId._id.toString() }, { userId: video.userId }] },
          { _id: { $ne: video._id.toString() } },
        ],
      },
      ['userId', 'teachingFiledId'],
    );
    return { currentVideo: video, relateVideoList };
  }

  async getMyVideo(userId: string) {
    return await this.demoVideoRepository.findAll({ userId }, ['userId', 'teachingFiledId']);
  }

  async getUserVideo(slug: string) {
    const user = await this.userRepository.findOne({ slug });
    return await this.demoVideoRepository.findAll({ userId: user._id }, ['userId', 'teachingFiledId']);
  }

  async create(userId: string, video: Express.Multer.File) {
    const videoName = this.generateFilename(video);
    await fs.promises.writeFile(path.join('./public/video/upload/', videoName), video.buffer);
    await this.demoVideoRepository.create({
      userId: userId,
      name: iconv.decode(Buffer.from(video.originalname, 'binary'), 'utf-8')?.split('.mp4')[0],
      teachingFiledId: (await this.teachingFiledRepository.findOne({}))._id,
      thumbnail: DEFAULT_PLACEHODER.VIDEO_THUMBNAIL,
      video: `video/upload/${videoName}`,
      description: '',
      view: 0,
    });
    return await this.updateTeachingFieldid(userId);
  }

  async delete(userId: string, id: string) {
    const video = await this.demoVideoRepository.findById(id);
    fs.unlink(path.join('./public/', video?.video), () => {});
    if (video?.thumbnail !== DEFAULT_PLACEHODER.VIDEO_THUMBNAIL)
      fs.unlink(path.join('./public/', video?.thumbnail), () => {});
    await this.demoVideoRepository.removeByFilter({ _id: id, userId: userId });
    return await this.updateTeachingFieldid(userId);
  }

  async uploadThumnail(id: string, thumbnail: Express.Multer.File) {
    const demoVideo = await this.demoVideoRepository.findOne({ _id: id });
    if (demoVideo?.thumbnail !== DEFAULT_PLACEHODER.VIDEO_THUMBNAIL)
      fs.unlink(path.join('./public/', demoVideo?.thumbnail), () => {});
    const fileName = this.generateFilename(thumbnail);
    const uploadPath = './public/video/upload/';
    await fs.promises.writeFile(path.join(uploadPath, fileName), thumbnail.buffer);
    const thumbnailPath = `video/upload/${fileName}`;
    return await this.demoVideoRepository.updateByFilter({ _id: id }, { thumbnail: thumbnailPath });
  }

  async update(userId: string, id: string, data: any) {
    await this.demoVideoRepository.updateByFilter({ _id: id }, data);
    return await this.updateTeachingFieldid(userId);
  }

  private async updateTeachingFieldid(userId: string) {
    const teachingFiledsFromDemoVideo = [
      ...new Set((await this.demoVideoRepository.findAll({ userId })).map((item) => item.teachingFiledId.toString())),
    ];
    console.log(teachingFiledsFromDemoVideo);

    this.tutorRepository.updateByFilter({ userId }, { teachingFiledsId: teachingFiledsFromDemoVideo });
  }
}
