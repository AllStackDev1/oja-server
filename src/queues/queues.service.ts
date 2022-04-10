import { Model, ObjectId } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common'

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
        await this._transact(e1.id, e1.deals[0], e2.deals[0])
        await this._transact(e2.id, e2.deals[0], e1.deals[0])
      } else {
        this.logger.debug('Could not process exchange...')
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
        await this.dealsService.addTransaction(
          receiver.id,
          DealStatusEnum.COMPLETED,
          {
            user: sender.user._id,
            amount: creditableAmountLeft,
            type: TransactionTypeEnum.RECEIVED
          }
        )

        // create transaction record for sender
        await this.dealsService.addTransaction(sender._id, null, {
          user: receiver.user._id,
          amount: creditableAmountLeft,
          type: TransactionTypeEnum.SENT
        })
        // TODO: send email notification of transaction performed
        this.logger.debug(`Deal ${receiver.id} is now fulfilled`)
      } else {
        // send debitable amount left as the amount to debit from the sender to the receiver
        await this.model.findByIdAndUpdate(queueId, { isProcessing: false })
        // create transaction record for sender
        await this.dealsService.addTransaction(sender.id, null, {
          type: TransactionTypeEnum.SENT,
          user: receiver.user._id,
          amount: debitableAmountLeft
        })
        // create transaction record for receiver
        await this.dealsService.addTransaction(
          receiver.id,
          DealStatusEnum.PROCESSING,
          {
            type: TransactionTypeEnum.RECEIVED,
            user: sender.user._id,
            amount: debitableAmountLeft
          }
        )
        // TODO: send email notification of transaction performed
        this.logger.debug(`Deal ${receiver.id} is yet to be fulfilled`)
      }
    } catch (err) {
      this.logger.error(err)
    }
  }

  _addDeal = async (type: string, dealId: ObjectId) => {
    let response = { success: true, message: null }
    try {
      const checker = await this.model.findOne({
        type,
        deals: { $in: [dealId] }
      })

      if (!checker) {
        await this.model.findOneAndUpdate(
          { type },
          { $push: { deals: dealId } },
          { upsert: true, setDefaultsOnInsert: true }
        )
      }
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }

  async _exchangeJob() {
    try {
      this.logger.debug('Processing deals in queues...')
      const exchanges: IQueue[] = await this.model
        .find({ isProcessing: false })
        .populate('deals')
        .populate({ path: 'deals.user', select: '_id' })
      this.logger.debug('Queues is now fetched...')
      const checkers: string[] = []
      exchanges.forEach(e1 => {
        // check if exchange type is already been processed
        if (!checkers.includes(e1.type)) {
          // get the opposite exchange type, this will help in getting the appropriate head to head exchange
          const e2Type = e1.type.split('_').reverse().join('_')
          this.logger.debug(
            `Opposite exchange type is now determined as ${e2Type}`
          )
          // update checker passing exchange type and opposite exchange type as been processed
          checkers.push(e1.type, e2Type)
          // find the opposite exchange data object
          const e2 = exchanges.find(e => e.type === e2Type)
          this.logger.debug('Opposite exchange data retrieved')
          // call the process method
          this._process(e1, e2)
        }
      })
    } catch (err) {
      this.logger.error(err)
    }
  }
}
