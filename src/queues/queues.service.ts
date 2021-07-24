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
    private readonly dealsService: DealsService
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

  private _process = async (e1: IQueue, e2: IQueue) => {
    try {
      // check to see if the queue deals has at least on deal
      if (e1?.deals?.length && e2?.deals?.length) {
        this.logger.debug(
          `processing exchange with #id ${e1._id} of type ${e1.type} and exchange with #id ${e2.id} of type ${e2.type}...`
        )

        const eIds = [e1.id, e2.id]
        // set e1 & e1 isProcessing to true
        eIds.forEach(async id => {
          await this.model.findByIdAndUpdate(id, { isProcessing: true })
        })

        // pop(pick) the first item in each deals array
        // to perform a transaction on each
        this._transact(e1._id, e1.deals[0], e2.deals[0])
        this._transact(e2._id, e2.deals[0], e1.deals[0])
      } else {
        this.logger.debug('Could not process exchange...')
      }
    } catch (err) {
      this.logger.error(err)
    }
  }

  private _transact = async (
    eId: ObjectId,
    eReceiver: IDeal,
    eSender: IDeal
  ) => {
    try {
      // determine the debitable amount left from the sender
      const debitableAmountLeft =
        +eSender.debit.amount -
        eSender.transactions.reduce((a, b) => {
          return (b.type === TransactionTypeEnum.SENT && a + +b.amount) || a
        }, 0)
      this.logger.debug(
        `Debitable amount left determined as ${debitableAmountLeft}...`
      )
      // determine the creditable amount left from the receiver
      const creditableAmountLeft =
        +eReceiver.credit.amount -
        eReceiver.transactions.reduce((a, b) => {
          return (b.type === TransactionTypeEnum.RECEIVED && a + +b.amount) || a
        }, 0)
      this.logger.debug(
        `Creditable amount left determined as ${creditableAmountLeft}...`
      )
      if (creditableAmountLeft <= debitableAmountLeft) {
        // send creditable amount left as the amount to debit from the sender to the receiver
        // this receiver(deal) is fulfilled and needs to be remove from queue
        await this.model.findByIdAndUpdate(eId, {
          isProcessing: false,
          $pop: { deals: -1 }
        })
        // create transaction record for receiver
        await this.dealsService.addTransaction(
          eReceiver.id,
          DealStatusEnum.COMPLETED,
          {
            type: TransactionTypeEnum.RECEIVED,
            user: eSender.user._id,
            amount: creditableAmountLeft
          }
        )
        // create transaction record for sender
        await this.dealsService.addTransaction(eSender._id, null, {
          type: TransactionTypeEnum.SENT,
          user: eReceiver.user._id,
          amount: creditableAmountLeft
        })

        this.logger.debug(`Deal ${eReceiver.id} is now fulfilled`)
      } else {
        // send debitable amount left as the amount to debit from the sender to the receiver
        await this.model.findByIdAndUpdate(eId, {
          isProcessing: false
        })
        // create transaction record for sender
        await this.dealsService.addTransaction(eSender.id, null, {
          type: TransactionTypeEnum.SENT,
          user: eReceiver.user._id,
          amount: debitableAmountLeft
        })
        // create transaction record for receiver
        await this.dealsService.addTransaction(
          eReceiver.id,
          DealStatusEnum.PROCESSING,
          {
            type: TransactionTypeEnum.RECEIVED,
            user: eSender.user._id,
            amount: debitableAmountLeft
          }
        )
        this.logger.debug(`Deal ${eReceiver.id} is yet to be fulfilled`)
      }
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async startProcessingQueues() {
    try {
      this.logger.debug('Processing Queues in progress...')
      const exchanges: IQueue[] = await this.model
        .find({ isProcessing: false })
        .populate('deals')
        .populate({ path: 'deals.user', select: '_id' })
      this.logger.debug('Queues is now fetched...')
      const checkers: string[] = []
      exchanges.forEach(exchange => {
        // check if queue type is already been processed
        if (!checkers.includes(exchange.type)) {
          // get the opposite exchange type
          const oppExchangeType = exchange.type.split('_').reverse().join('_')
          this.logger.debug(
            `Opposite exchange type is now determined as ${oppExchangeType}`
          )
          // update checker passing queue.type and opposite queue type as been processed
          checkers.push(exchange.type, oppExchangeType)
          // find the opposite queue data object
          const oppExchange = exchanges.find(
            exchange => exchange.type === oppExchangeType
          )
          this.logger.debug('Opposite exchange data retrieved')
          // call the process method
          this._process(exchange, oppExchange)
        }
      })
    } catch (err) {
      this.logger.error(err)
    }
  }
}
