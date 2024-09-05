import { SubscribeRepository } from './../subscribe/subscribe.repository';
import { RoomService } from './../room/room.service';
import { IToken } from '@common/interfaces/auth.interface';
import { handleLogError, handleLogInfo } from '@common/utils/helper.utils';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { verify } from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import LogService from 'src/config/log.service';
import { SOCKET_SCREEN, SOCKET_SCREEN_ACTION } from './websocket.enum';
import { WebSocketService } from './websocket.service';
import {
  IDisconnectPayload,
  IJoinNotifyPayload,
  IJoinPayload,
  IMessPayload,
  ISendNotifyPayload,
  ISignalPayload,
} from 'src/dto/meeting.dto';
import { Roles } from '@common/constants/global.const';
import { NotificationService } from '@modules/notification/notification.service';
import { NotifyDTO } from 'src/dto/notify.dto';
import { NotifyUserRepository } from '@modules/notification/notifyUser.repository';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    private socketService: WebSocketService,
    private roomService: RoomService,
    private notifyService: NotificationService,
    private subscribeRepository: SubscribeRepository,
    private notifyUserRepository: NotifyUserRepository,
  ) {}

  @WebSocketServer() server: Server;
  wsClients = new Map<string, Socket>();
  private roomClients: Map<string, Set<string>> = new Map();

  afterInit(server: Server) {
    this.socketService.socketServer = server;
  }

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth;

    try {
      const userInfo = verify(token || '', process.env.JWT_SECRET_KEY || '') as IToken;
      if (!userInfo) {
        handleLogInfo(`[SOCKET-hehe] disconect =====================`);
        client.disconnect();
        return;
      }
      this.wsClients.set(userInfo.userId, client);
      handleLogInfo(`[SOCKET-hehe] ${userInfo.userId} ${String(client.id)} `);
    } catch (err) {
      handleLogError(err);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    handleLogInfo('[SOCKET][DISCONNECT] ' + String(client.id));
    for (const [userId, socket] of this.wsClients.entries()) {
      if (socket.id === client.id) {
        this.wsClients.delete(userId);
        break;
      }
    }

    this.broadcast('disconnect', {});
  }

  private broadcast(event: string, message?: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.wsClients.forEach((socket, clientId) => {
        socket.emit(event, message);
      });
    } catch (e) {
      LogService.logError(e);
      return null;
    }
  }

  private broadcastClient(event: string, userId?: string, message?: string) {
    try {
      if (!this.wsClients.has(userId)) return null;
      this.wsClients.get(userId).emit(event, message);
    } catch (e) {
      LogService.logError(e);
      return null;
    }
  }

  sendSocket(screen: SOCKET_SCREEN, action?: SOCKET_SCREEN_ACTION, payload?: any) {
    this.broadcast(screen, { action, payload });
  }

  @SubscribeMessage(SOCKET_SCREEN_ACTION.JOIN)
  async onJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { payload: IJoinPayload }) {
    const { roomId, role, ...rest } = data.payload;
    handleLogInfo('[SOCKET][JOIN_ROOM] ' + String(roomId));
    client.join(roomId);
    let isHost = true;
    if (role !== Roles.TUTOR) isHost = false;
    const room = await this.roomService.memberJoin(
      roomId,
      data.payload.userId,
      isHost,
      client.id,
      data.payload.userName,
    );
    this.server
      .to(roomId)
      .emit(SOCKET_SCREEN_ACTION.USER_JOINED, { payload: { id: client.id, roomId, ...rest, isHost, room } });
  }

  @SubscribeMessage(SOCKET_SCREEN_ACTION.SIGNAL)
  async onSignal(@ConnectedSocket() client: Socket, @MessageBody() data: { payload: ISignalPayload }) {
    const { to, ...rest } = data.payload;
    this.server.to(to).emit(SOCKET_SCREEN_ACTION.SIGNAL, { payload: { from: client.id, ...rest } });
  }

  @SubscribeMessage(SOCKET_SCREEN_ACTION.LEAVE)
  async onDisconnect(@ConnectedSocket() client: Socket, @MessageBody() data: { payload: IDisconnectPayload }) {
    const { roomId, userId, userName } = data.payload;
    handleLogInfo('[SOCKET][LEAVE_ROOM] ' + String(roomId));
    const newRoom = await this.roomService.memberLeave(roomId, userId);
    for (const room of client.rooms) {
      this.server
        .to(room)
        .emit(SOCKET_SCREEN_ACTION.USER_LEFT, { payload: { id: client.id, newRoom, userLeft: userName } });
    }
  }

  @SubscribeMessage(SOCKET_SCREEN_ACTION.MESSAGE)
  async onMess(@ConnectedSocket() client: Socket, @MessageBody() data: { payload: IMessPayload }) {
    const { roomId, ...rest } = data.payload;
    this.server.to(roomId).emit(SOCKET_SCREEN_ACTION.MESSAGE, { payload: { ...rest } });
  }

  @SubscribeMessage(SOCKET_SCREEN_ACTION.JOIN_NOTIFY)
  async onJoinNotify(@ConnectedSocket() client: Socket, @MessageBody() data: { payload: IJoinNotifyPayload }) {
    const { userId, ...rest } = data.payload;
    const owner = await this.subscribeRepository.distinct('owner', { subscriber: userId });
    owner.forEach((ownerId) => {
      client.join(ownerId.toString());
    });
    const notify = await this.notifyService.getNotificationByUser(userId);
    handleLogInfo('[SOCKET][JOIN_NOTIFY] ' + String(owner));
    client.emit(SOCKET_SCREEN_ACTION.USER_JOIN_NOTIFY, { payload: { id: client.id, owner, notify, ...rest } });
  }

  @SubscribeMessage(SOCKET_SCREEN_ACTION.SEND_NOTIFY)
  async sendNotify(@ConnectedSocket() client: Socket, @MessageBody() data: { payload: ISendNotifyPayload }) {
    try {
      const newNotify = await this.notifyService.createNotification(data.payload);
      const subscribers = await this.subscribeRepository.distinct('subscriber', { owner: data.payload.owner });
      const notifyUser: { user: string; notifyId: string }[] = [];
      subscribers.forEach((subscriber) => {
        notifyUser.push({ user: subscriber.toString(), notifyId: newNotify._id });
      });
      await this.notifyUserRepository.createMany(notifyUser);
      this.server.to(data.payload.owner).emit(SOCKET_SCREEN_ACTION.SEND_NOTIFY, { payload: { id: client.id } });
    } catch (err) {
      handleLogError(err);
    }
  }

  // @SubscribeMessage(SOCKET_SCREEN_ACTION.GET_NOTIFY)
  // async
}
