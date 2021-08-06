import * as Scheduler from 'node-schedule'
import { Injectable } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { QueuesService } from 'queues/queues.service'

@Injectable()
export class CronsService {
  constructor(private readonly queuesService: QueuesService) {
    this.runEvery30Seconds()
  }

  runEvery30Seconds = () => {
    Scheduler.scheduleJob(CronExpression.EVERY_30_SECONDS, () => {
      this.queuesService._exchangeJob()
    })
  }
}
