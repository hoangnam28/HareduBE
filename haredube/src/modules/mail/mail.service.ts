import { CONFIRM_FORGOT_PASSWORD, CONFIRM_REGISTRATION, QUEUE } from '@common/constants/queue.const';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bull';
import LogService from 'src/config/log.service';

@Injectable()
export class MailService {
  constructor(@InjectQueue(QUEUE.mailQueue) private readonly _mailQueue: Queue) {}

  public async sendConfirmationEmailRegister(email: string, url: string): Promise<void> {
    try {
      await this._mailQueue.add(CONFIRM_REGISTRATION, {
        email,
        url,
      });
    } catch (error) {
      LogService.logErrorFile(error);
      throw error;
    }
  }

  public async sendConfirmationEmailForgot(email: string, url: string): Promise<void> {
    try {
      await this._mailQueue.add(CONFIRM_FORGOT_PASSWORD, {
        email,
        url,
      });
    } catch (error) {
      LogService.logErrorFile(error);
      throw error;
    }
  }
}
