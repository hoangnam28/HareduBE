import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongo-config.service';
import { ThrottlerConfigService } from './config/throttler-config.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { SocketModule } from '@modules/websocket/websocket.module';
import { DemoModule } from './modules/demo/demo.module';
import { TeachingFiledModule } from './modules/teaching-filed/teaching-filed.module';
import { PostModule } from './modules/post/post.module';
import { ClassroomModule } from './modules/classroom/classroom.module';
import { SlotModule } from './modules/slot/slot.module';
import { NoteModule } from './modules/note/note.module';
import { MessageModule } from './modules/message/message.module';
import { SystemModule } from './modules/system/system.module';
import { NotificationModule } from './modules/notification/notification.module';
import { GalleryModule } from '@modules/gallery/gallery.module';
import { UserModule } from '@modules/user/user.module';
import { MailModule } from '@modules/mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { AgoreModule } from './modules/agore/agore.module';
import { PayosModule } from './modules/payos/payos.module';
import { DemoVideoModule } from '@modules/video/video.module';
import { RoomModule } from './modules/room/room.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    SocketModule,
    ScheduleModule.forRoot(),
    AuthModule,
    TokenModule,
    DemoModule,
    TeachingFiledModule,
    PostModule,
    ClassroomModule,
    SlotModule,
    NoteModule,
    MessageModule,
    SystemModule,
    NotificationModule,
    GalleryModule,
    UserModule,
    MailModule,
    AgoreModule,
    PayosModule,
    DemoVideoModule,
    RoomModule,
    TransactionModule,
    SubscribeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
