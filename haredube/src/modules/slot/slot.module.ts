import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotSchema } from '@models/slot.model';
import { SlotRepository } from './slot.repository';
import { Classroom, ClassroomSchema } from '@models/classroom.model';
import { ClassroomRepository } from '@modules/classroom/classroom.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Slot.name, schema: SlotSchema },
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
  ],
  controllers: [SlotController],
  providers: [SlotService, SlotRepository, ClassroomRepository],
})
export class SlotModule {}
