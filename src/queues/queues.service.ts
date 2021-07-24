import { Model, ObjectId } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { CreateQueueDto, UpdateQueueDto } from './dto'
import { CrudService } from 'lib/crud.service'
import {
  DealStatusEnum,
  IDeal,
  IQueue,
  TransactionTypeEnum
} from 'lib/interfaces'
import { DealsService } from 'deals/deals.service'

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
    protected readonly model: Model<IQueue>,
    @Inject(forwardRef(() => DealsService))
    private readonly dService: DealsService
  ) {
    super(model)
  }

  addDeal = async (type: string, dealId: ObjectId) => {
    let response = { success: true, message: null }
    try {
      await this.model.findOneAndUpdate(
        { type },
        { $push: { deals: dealId } },
        { upsert: true }
      )
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }

  private _process = async (q1: IQueue, q2: IQueue) => {
    try {
      // check to see if the queue deals has at least on deal
      if (q1.deals.length && q2.deals.length) {
        this.logger.debug(
          `processing queue with #id ${q1._id} of type ${q1.type} and queue with #id ${q2.id} of type ${q2.type}...`
        )

        const queueIds = [q1.id, q2.id]
        // set q1 & q2 isProcessing to true
        queueIds.forEach(async id => {
          await this.model.findByIdAndUpdate(id, { isProcessing: true })
        })

        // pop(pick) the first item in each deals array
        // to perform a transaction on each
        this._transact(q1._id, q1.deals[0], q2.deals[0])
        this._transact(q2._id, q2.deals[0], q1.deals[0])
      } else {
        this.logger.debug(
          `Could not process queue with #id ${q1._id} of type ${q1.type} and queue with #id ${q2.id} of type ${q2.type}...`
        )
      }
    } catch (err) {
      this.logger.error(err)
    }
  }

  private _transact = async (
    queueId: ObjectId,
    receiver: IDeal,
    sender: IDeal
  ) => {
    try {
      // determine the debitable amount left from the sender
      const debitableAmountLeft =
        +sender.debit.amount -
        sender.transactions.reduce((a, b) => {
          return (b.type === TransactionTypeEnum.SENT && a + +b.amount) || a
        }, 0)
      this.logger.debug(
        `Debitable amount left determined as ${debitableAmountLeft}...`
      )
      // determine the creditable amount left from the receiver
      const creditableAmountLeft =
        +receiver.credit.amount -
        receiver.transactions.reduce((a, b) => {
          return (b.type === TransactionTypeEnum.RECEIVED && a + +b.amount) || a
        }, 0)
      this.logger.debug(
        `Creditable amount left determined as ${creditableAmountLeft}...`
      )
      if (creditableAmountLeft <= debitableAmountLeft) {
        // send creditable amount left as the amount to debit from the sender to the receiver
        // this receiver(deal) is fulfilled and needs to be remove from queue
        await this.model.findByIdAndUpdate(queueId, {
          isProcessing: false,
          $pop: { deals: -1 }
        })
        // create transaction record for receiver
        await this.dService.addTransaction(
          receiver.id,
          DealStatusEnum.COMPLETED,
          {
            type: TransactionTypeEnum.RECEIVED,
            user: sender.user._id,
            amount: creditableAmountLeft
          }
        )
        // create transaction record for sender
        await this.dService.addTransaction(sender._id, null, {
          type: TransactionTypeEnum.SENT,
          user: receiver.user._id,
          amount: creditableAmountLeft
        })

        this.logger.debug(`Deal ${receiver.id} is now fulfilled`)
      } else {
        // send debitable amount left as the amount to debit from the sender to the receiver
        await this.model.findByIdAndUpdate(queueId, {
          isProcessing: false
        })
        // create transaction record for receiver
        await this.dService.addTransaction(
          receiver.id,
          DealStatusEnum.PROCESSING,
          {
            type: TransactionTypeEnum.RECEIVED,
            user: sender.user._id,
            amount: creditableAmountLeft
          }
        )
        // create transaction record for sender
        await this.dService.addTransaction(sender.id, null, {
          type: TransactionTypeEnum.SENT,
          user: receiver.user._id,
          amount: debitableAmountLeft
        })
        this.logger.debug(`Deal ${receiver.id} is yet to be fulfilled`)
      }
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async startProcessingQueues() {
    try {
      this.logger.debug('Processing Queues in progress...')
      const queues: IQueue[] = await this.model
        .find()
        .populate('deals')
        .populate({ path: 'deals.user', select: '_id' })
      this.logger.debug('Queues is now fetched...')
      const checkers: string[] = []
      // queues = JSON.parse(JSON.stringify(queues))
      queues.forEach(queue => {
        // check if queue type is already been processed
        if (!checkers.includes(queue.type)) {
          // get the opposite queue type
          const oppQueueType = queue.type.split('_').reverse().join('_')
          this.logger.debug(
            `Opposite queue type is now determined as ${oppQueueType}`
          )
          // update checker passing queue.type and opposite queue type as been processed
          checkers.push(queue.type, oppQueueType)
          // find the opposite queue data object
          const oppQueue = queues.find(queue => queue.type === oppQueueType)
          this.logger.debug('Opposite queue data retrieved')
          // call the process method
          this._process(queue, oppQueue)
        }
      })
    } catch (err) {
      this.logger.error(err)
    }
  }
}
