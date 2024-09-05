import { CRON_EXPRESSION } from '@common/constants/cron-job.const';
import { TokensRepository } from './../token/token.repository';
// import { EXPORT_DIR, TMP_DIR } from '@common/constants/file.const';
// import { ONE_DAY_TO_MS } from '@common/constants/global.const';
import { handleLogInfo } from '@common/utils/helper.utils';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class CronJobService {
  constructor(private tokenRepository: TokensRepository) {}

  @Cron(CRON_EXPRESSION.MIDNIGHT_EVERY_DAY)
  async deleteExpiredTokensJob() {
    handleLogInfo('DELETE_EXPIRED_TOKENS_JOB_AND_USER_NOT_CONFIRM is running');
    const last2month = moment().subtract(2, 'month').toDate();
    await this.tokenRepository.removeByFilter({ updatedAt: { $lt: last2month } });
    handleLogInfo('DELETE_EXPIRED_TOKENS_JOB_AND_USER_NOT_CONFIRM');
  }
}
