import { EMAIL_FROM, SYSTEM_NAME } from '@common/constants/global.const';
import { QUEUE, defaultJobOptions } from '@common/constants/queue.const';
import { UserModule } from '@modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailProcessor } from './mail.proccesor';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('SENDGRID_API_KEY'),
          },
        },
        defaults: {
          from: `"${SYSTEM_NAME.MIXED}" <${EMAIL_FROM}>`,
        },
        template: {
          dir: 'dist/assets/template',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    BullModule.registerQueue({
      name: QUEUE.mailQueue,
      defaultJobOptions,
    }),
    forwardRef(() => UserModule),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
