import { Module, Global } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { SocketGateway } from './websocket.gateway';
import { RoomModule } from '@modules/room/room.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { SubscribeModule } from '@modules/subscribe/subscribe.module';

@Global()
@Module({
  imports: [RoomModule, NotificationModule, SubscribeModule],
  providers: [WebSocketService, SocketGateway],
  exports: [WebSocketService, SocketGateway],
})
export class SocketModule {}
