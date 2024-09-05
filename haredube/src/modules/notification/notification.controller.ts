import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiNormalResponse } from '@common/decorators/api-response';
import { NotifyUser } from '@models/notifyUser.model';
import { JwtTokenDecrypted } from '@common/interfaces/auth.interface';
import { ResponseType } from '@common/constants/global.const';
import { Profile } from '@common/decorators/user.decorator';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiNormalResponse({ model: NotifyUser, type: ResponseType.Ok })
  getRoomBySlotId(@Profile() user: JwtTokenDecrypted) {
    return this.notificationService.getNotificationByUser(user.userId);
  }

  @Put()
  @ApiNormalResponse({ model: NotifyUser, type: ResponseType.Ok })
  viewNotify(@Profile() user: JwtTokenDecrypted) {
    return this.notificationService.updateNotification(user.userId);
  }
}
