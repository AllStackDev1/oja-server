import * as Scheduler from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { QueuesService } from 'queues/queues.service'
import { GmailScrapperService } from 'gmail-scrapper/gmail-scrapper.service'

@Injectable()
export class CronsService {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly gmailScrapperService: GmailScrapperService
  ) {
    Scheduler.scheduleJob(CronExpression.EVERY_MINUTE, () => {
      this.queuesService._exchangeJob()
    })
    // Scheduler.scheduleJob(CronExpression.EVERY_5_SECONDS, () => {
    //   this.gmailScrapperService.__main__()
    // })
  }
}
