import { Logger } from '@nestjs/common'
import scheduler from 'node-schedule'
import { CronExpression } from '@nestjs/schedule'

export const CronJobs = () => {
  const logger = new Logger(CronJobs.name)

  const RunEvery30Seconds = () => {
    scheduler.scheduleJob(CronExpression.EVERY_30_SECONDS, () => {
      logger.debug('Called every 10 seconds')
    })
  }

  const Register = () => {
    RunEvery30Seconds()
  }

  return Register
}
