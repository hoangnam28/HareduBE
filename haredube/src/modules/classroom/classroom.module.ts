import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Classroom, ClassroomSchema } from '@models/classroom.model';
import { ClassroomRepository } from './classroom.repository';
import { User, UserSchema } from '@models/user.model';
import { UsersRepository } from '@modules/user/user.repository';
import { Gallery, GallerySchema } from '@models/gallery.model';
import { Slot, SlotSchema } from '@models/slot.model';
import { TeachingFiled, TeachingFiledSchema } from '@models/teaching-filed.model';
import { SlotRepository } from '@modules/slot/slot.repository';
import { TransactionModule } from '@modules/transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
      { name: User.name, schema: UserSchema },
      { name: Gallery.name, schema: GallerySchema },
      { name: Slot.name, schema: SlotSchema },
      { name: TeachingFiled.name, schema: TeachingFiledSchema },
    ]),
    TransactionModule,
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, ClassroomRepository, UsersRepository, SlotRepository],
})
export class ClassroomModule {}
