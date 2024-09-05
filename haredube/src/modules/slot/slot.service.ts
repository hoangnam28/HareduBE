import { ClassroomRepository } from './../classroom/classroom.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SlotRepository } from './slot.repository';
import { CreateManySlotDto, CreateSlotDto } from 'src/dto/slot.dto';
import { Pagination } from '@common/interfaces/filter.interface';

@Injectable()
export class SlotService {
  constructor(
    private slotRepository: SlotRepository,
    private classroomRepository: ClassroomRepository,
  ) {}

  async createSlot(userId: string, createSlotDto: CreateSlotDto) {
    const classroom = await this.classroomRepository.findOne({ lecture: userId, _id: createSlotDto.classroomId });
    if (!classroom) {
      throw new BadRequestException('Access denied!');
    }
    const newClass = await this.slotRepository.create({ ...createSlotDto });
    this.classroomRepository.update(classroom._id, { $push: { slots: newClass._id } });
    return newClass;
  }

  async getSlots(pagination: Pagination, classroomId: string) {
    const [data, total] = await this.slotRepository.paginate({
      pagination: {
        ...pagination,
        classroomId: classroomId,
        sortType: 'asc',
      },
    });

    return { data, total };
  }

  async findSlotById(slotId: string) {
    const slot = await this.slotRepository.findById(slotId);
    return slot;
  }

  async createManySlot(userId: string, slots: CreateManySlotDto) {
    const classroom = await this.classroomRepository.findOne({ lecture: userId, _id: slots.classroomId });
    if (!classroom) {
      throw new BadRequestException('Access denied!');
    }
    return await this.slotRepository.createMany(slots.slots);
  }
}
