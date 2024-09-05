import { Module } from '@nestjs/common';
import { AgoreService } from './agore.service';
import { AgoreController } from './agore.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotSchema } from '@models/slot.model';
import { SlotRepository } from '@modules/slot/slot.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }])],
  controllers: [AgoreController],
  providers: [AgoreService, SlotRepository],
})
export class AgoreModule {}
