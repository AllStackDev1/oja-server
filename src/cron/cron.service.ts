import * as Scheduler from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { QueuesService } from 'queues/queues.service'

@Injectable()
export class CronsService {
  constructor(private readonly queuesService: QueuesService) {
    Scheduler.scheduleJob(CronExpression.EVERY_10_SECONDS, () => {
      this.queuesService._exchangeJob()
    })
  }
}
