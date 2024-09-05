import { Roles } from '@common/constants/global.const';
import { Members, Room } from '@models/meeting.model';
import { PickType } from '@nestjs/swagger';

export interface IJoinPayload {
  roomId: string;
  userName: string;
  userId: string;
  role: Roles;
}

export interface ISignalPayload {
  to: string;
  userId: string;
  userName: string;
  signal: any;
  priority: number;
}

export interface IDisconnectPayload {
  roomId: string;
  userName: string;
  userId: string;
}

export interface IMessPayload {
  userName: string;
  userId: string;
  message: string;
  roomId: string;
}

export class CreateRoomDto extends PickType(Room, ['slotId']) {}

export class MemberDto extends PickType(Members, ['userId', 'isHost']) {}
// export class CreateRoomDto {
//   @IsNotEmpty()
//   slotId: string;

//   @IsNotEmpty()
//   member: Members;
// }

export interface ISendNotifyPayload {
  owner: string;
}

export interface IJoinNotifyPayload {
  userId: string;
}

export interface ISendNotifyPayload {
  title: string;
  owner: string;
  link?: string;
}
