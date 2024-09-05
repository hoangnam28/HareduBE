import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from '@models/notification.model';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyRepository } from './notification.repository';
import { NotifyUser, NotifyUserSchema } from '@models/notifyUser.model';
import { NotifyUserRepository } from './notifyUser.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: NotifyUser.name, schema: NotifyUserSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotifyRepository, NotifyUserRepository],
  exports: [NotificationService, NotifyRepository, NotifyUserRepository],
})
export class NotificationModule {}
