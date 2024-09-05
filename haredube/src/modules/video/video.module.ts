import { Module } from '@nestjs/common';
import { DemoVideoService } from './video.service';
import { DemoVideoController } from './video.controller';
import { DemoVideo, DemoVideoSchema } from '@models/demo-video.model';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoVideoRepository } from './video.repository';
import { User, UserSchema } from '@models/user.model';
import { TeachingFiled, TeachingFiledSchema } from '@models/teaching-filed.model';
import { TeachingFiledRepository } from '@modules/teaching-filed/teaching-filed.repository';
import { Tutor, TutorSchema } from '@models/tutor.model';
import { TutorRepository } from '@modules/auth/tutor.repository';
import { UsersRepository } from '@modules/user/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DemoVideo.name, schema: DemoVideoSchema },
      { name: User.name, schema: UserSchema },
      { name: TeachingFiled.name, schema: TeachingFiledSchema },
      { name: Tutor.name, schema: TutorSchema },
    ]),
  ],
  controllers: [DemoVideoController],
  providers: [DemoVideoService, DemoVideoRepository, TeachingFiledRepository, TutorRepository, UsersRepository],
  exports: [DemoVideoService, DemoVideoRepository, TeachingFiledRepository, TutorRepository],
})
export class DemoVideoModule {}
