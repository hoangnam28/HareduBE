import { CreateRoomDto, MemberDto } from 'src/dto/meeting.dto';
import { RoomRepository } from './room.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemNotFoundMessage } from '@common/utils/helper.utils';
import { Types } from 'mongoose';

@Injectable()
export class RoomService {
  constructor(private roomRepository: RoomRepository) {}

  async createRoom(userId: string, data: CreateRoomDto) {
    return await this.roomRepository.create(data);
  }

  async getRoomBySlotId(slotId: string) {
    const room = await this.roomRepository.findOne({ slotId });
    if (!room) throw new BadRequestException('Room was not created');
    return room;
  }

  async memberJoin(slotId: string, userId: string, isHost: boolean, clientId: string, userName: string) {
    const room = await this.getRoomBySlotId(slotId);
    const isMember = room.members.find((member) => member.userId.toString() === userId);
    if (!isMember) {
      room.members.push({ userId: new Types.ObjectId(userId), isHost, clientId, userName });
      await room.updateOne({ members: room.members });
    } else {
      const index = room.members.findIndex((member) => member.userId.toString() === userId);
      room.members[index].clientId = clientId;
      await room.updateOne({ members: room.members });
    }
    return room;
  }

  async memberLeave(slotId: string, userId: string) {
    const room = await this.getRoomBySlotId(slotId);
    const index = room.members.findIndex((member) => member.userId.toString() === userId);
    if (index !== -1) {
      room.members.splice(index, 1);
      await room.updateOne({ members: room.members });
    }
    return room;
  }
}
