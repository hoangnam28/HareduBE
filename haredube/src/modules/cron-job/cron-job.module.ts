import { TokenModule } from '@modules/token/token.module';
import { Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';

@Module({
  imports: [TokenModule],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
