import { EMAIL_FROM, MAIL_TEMPLATE, SYSTEM_NAME } from '@common/constants/global.const';
import { CONFIRM_FORGOT_PASSWORD, QUEUE } from '@common/constants/queue.const';
import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import LogService from 'src/config/log.service';
import { CONFIRM_REGISTRATION } from '../../common/constants/queue.const';

@Injectable()
@Processor(QUEUE.mailQueue)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(private readonly _mailerService: MailerService) {}

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<{ email: string; url: string }>) {
    LogService.logInfo(`Sending confirm registration email to '${job.data.email}'`);

    return await this._mailerService.sendMail({
      to: job.data.email,
      from: {
        name: SYSTEM_NAME.MIXED,
        address: EMAIL_FROM,
      },
      template: MAIL_TEMPLATE.REGISTER,
      subject: `${SYSTEM_NAME.MIXED}: Please verify your account`,
      context: {
        email: job.data.email,
        linkVerify: job.data.url,
        storeName: SYSTEM_NAME.MIXED,
      },
    });
  }

  @Process(CONFIRM_FORGOT_PASSWORD)
  public async confirmForgotPassword(job: Job<{ email: string; url: string }>) {
    LogService.logInfo(`Sending confirm registration email to '${job.data.email}'`);

    return await this._mailerService.sendMail({
      to: job.data.email,
      from: {
        name: SYSTEM_NAME.MIXED,
        address: EMAIL_FROM,
      },
      template: MAIL_TEMPLATE.FORGOT_PASSWORD,
      subject: `${SYSTEM_NAME.MIXED}: Please verify your account`,
      context: {
        email: job.data.email,
        linkResetPassword: job.data.url,
        storeName: SYSTEM_NAME.MIXED,
      },
    });
  }

  @OnQueueActive()
  public onActive(job: Job) {
    LogService.logInfo(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    LogService.logInfo(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    LogService.logErrorFile(
      `Failed job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}: ${error.message}`,
      error.stack,
    );
  }
}
