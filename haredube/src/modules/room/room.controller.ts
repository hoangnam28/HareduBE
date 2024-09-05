import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from 'src/dto/meeting.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { Room } from '@models/meeting.model';
import { ResponseType } from '@common/constants/global.const';
import { Profile } from '@common/decorators/user.decorator';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';

@Controller('rooms')
@ApiTags('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiBody({ type: CreateRoomDto })
  @ApiNormalResponse({ model: Room, type: ResponseType.Created })
  createClassroom(@Profile() user: JwtTokenDecrypted, @Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(user.userId, createRoomDto);
  }

  @Get('/:slotId')
  @ApiParam({ name: 'slotId', type: String, required: true })
  @ApiNormalResponse({ model: Room, type: ResponseType.Ok })
  getRoomBySlotId(@Profile() user: JwtTokenDecrypted, @Param('slotId') slotId: string) {
    return this.roomService.getRoomBySlotId(slotId);
  }
}
