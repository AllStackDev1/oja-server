import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { CreateQueueDto, UpdateQueueDto } from './dto'
import { CrudService } from 'lib/crud.service'
import { IQueue } from 'lib/interfaces'

@Injectable()
export class QueuesService extends CrudService<
  IQueue,
  CreateQueueDto,
  UpdateQueueDto
> {
  private readonly logger = new Logger(QueuesService.name)
  protected readonly name = 'Queue'

  constructor(
    @InjectModel('Queue')
    protected readonly model: Model<IQueue>
  ) {
    super(model)
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  protected async handleTransaction() {
    try {
      this.logger.debug('Called handle transaction cron')
      const queues: Record<string, string | [IQueue]>[] =
        await this.model.aggregate([
          { $match: {} },
          {
            $lookup: {
              from: 'deals',
              let: { deal: '$deal' },
              pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deal'] } } }],
              as: 'deal'
            }
          },
          { $unwind: '$deal' },
          {
            $group: {
              _id: { currency: '$deal.credit.currency' },
              deals: { $push: '$deal' }
            }
          },
          {
            $project: { _id: 0, currency: '$_id.currency', deals: 1 }
          }
        ])
      queues.forEach(queue => {
        console.log(queue)
      })
    } catch (err) {
      this.logger.error(err)
    }
  }
}
