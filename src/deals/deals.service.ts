import { Model, ObjectId } from 'mongoose'
import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as pluralize from 'pluralize'

import { CrudService } from 'lib/crud.service'
import { QueuesService } from 'queues/queues.service'
import { CurrenciesService } from 'currencies/currencies.service'
import { GmailScrapperService } from 'gmail-scrapper/gmail-scrapper.service'

import {
  IDeal,
  DealStatusEnum,
  ResponsePayload,
  TransactionTypeEnum
} from 'lib/interfaces'
import { CreateDealDto, UpdateDealDto } from './dto'
import { CreateTransactionDto } from './dto/create-transaction.dto'

@Injectable()
export class DealsService extends CrudService<
  IDeal,
  CreateDealDto,
  UpdateDealDto
> {
  protected readonly name = 'Deal'

  constructor(
    @InjectModel('Deal')
    protected readonly model: Model<IDeal>,
    private readonly currenciesService: CurrenciesService,
    @Inject(forwardRef(() => QueuesService))
    private readonly queuesService: QueuesService,
    private readonly gmailScrapperService: GmailScrapperService
  ) {
    super(model)
  }

  async processInterac(id: ObjectId) {
    let response: ResponsePayload<any, string> = {
      success: true
    }
    try {
      const { auth, data } = await this.gmailScrapperService.__main__()
      if (data?.length) {
        const doc: IDeal = await this.model.findById(id)

        const found = data.find(
          d =>
            d.name === doc.interacName && d.amount * 100 === +doc.debit.amount
        )
        console.log(found)

        if (found) {
          if (doc.status === DealStatusEnum.PENDING) {
            await this.queuesService._addDeal(doc.type, doc._id)
            doc.status = DealStatusEnum.PROCESSING
            await doc.save()
            await this.gmailScrapperService.markMessageRead(found.msgId, auth)
            console.log('first')
            response.message = 'Deal is now been processed'
          } else {
            response.message = 'Deal already been processed'
          }
        } else {
          response = {
            success: false,
            message: 'Failed to verify, please try again after some time'
          }
        }
      } else {
        response = {
          success: false,
          message: 'Failed to verify, please try again after some time'
        }
      }
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async processSendCash(id: ObjectId) {
    let response: ResponsePayload<any, string> = {
      success: true
    }
    try {
      const doc: IDeal = await this.model.findByIdAndUpdate(
        id,
        { status: DealStatusEnum.PROCESSING },
        { new: true }
      )
      await this.queuesService._addDeal(doc.type, doc._id)
      response.message = 'Deal is now been processed'
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async addTransaction(
    id: ObjectId,
    status: DealStatusEnum,
    transaction: CreateTransactionDto
  ) {
    let response: ResponsePayload<IDeal, string> = {
      success: true
    }
    try {
      let payload = {}
      if (status) {
        payload = { $set: { status }, $push: { transactions: transaction } }
      } else {
        payload = { $push: { transactions: transaction } }
      }

      response.data = await this.model.findByIdAndUpdate(id, payload)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async findById(id: ObjectId): Promise<ResponsePayload<any, string>> {
    let response: ResponsePayload<any, string> = {
      success: true
    }
    try {
      const doc = await this.model
        .findById(id)
        .populate({ path: 'transactions.user', select: 'username' })
        .lean()

      // we query the countries service to get the details of the
      // currencies involved in this deal.
      const type = doc.type.split('_')
      const { data } = await this.currenciesService.find({
        $or: [{ code: type[0] }, { code: type[1] }]
      })

      // calculate the total amount received to fulfill the credit amount,
      // this amount will be used to calculate % of the progress made to
      // fulfill the credit amount.
      let total = 0
      let transactions = null
      if (doc.transactions?.length) {
        total = doc.transactions.reduce((a, b) => {
          return (b.type === TransactionTypeEnum.RECEIVED && a + +b.amount) || a
        }, 0)

        transactions = doc.transactions.map(t => ({
          ...t,
          amount: +t.amount / 100,
          user: '@' + t.user?.username
        }))
      }

      const debitCurrency = data.find(e => e.code === type[0])
      const creditCurrency = data.find(e => e.code === type[1])

      response.data = {
        _id: doc._id,
        rate: +doc.rate,
        type: doc.type,
        transactions,
        createdAt: doc.createdAt,
        settlementFee: +doc.settlementFee / 100,
        transactionFee: +doc.transactionFee / 100,
        progress: +parseFloat('' + (total / +doc.credit.amount) * 100).toFixed(
          2
        ),
        debit: {
          ...doc.debit,
          amount: +doc.debit.amount / 100,
          currency: {
            name: debitCurrency.name,
            code: debitCurrency.code,
            symbol: debitCurrency.symbol
          }
        },
        credit: {
          ...doc.credit,
          amount: +doc.credit.amount / 100,
          currency: {
            name: creditCurrency.name,
            code: creditCurrency.code,
            symbol: creditCurrency.symbol
          }
        }
      }
      response.message = `${this.name} found`
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async find(payload: any): Promise<ResponsePayload<any[], string>> {
    let response: ResponsePayload<any[], string> = {
      success: true
    }
    try {
      const docs = await this.model
        .find(payload)
        .populate({ path: 'transactions.user', select: 'username' })
        .sort({ createdAt: -1, _id: -1 })
        .lean()

      // We are going to perform another query to get currency info
      // needed in the frontend so we have to await all promise
      const deals = await Promise.all(
        docs.map(async doc => {
          // calculate the total amount received to fulfill the credit amount,
          // this amount will be used to calculate % of the progress made to
          // fulfill the credit amount.
          let total = 0
          let lt = null
          if (doc.transactions?.length) {
            total = doc.transactions.reduce((a, b) => {
              return (
                (b.type === TransactionTypeEnum.RECEIVED && a + +b.amount) || a
              )
            }, 0)
            // pick the last transaction in the array which is the latest transaction
            lt = doc.transactions[doc.transactions.length - 1]
          }

          // we query the countries service to get the details of the
          // currencies involved in this deal.
          const type = doc.type.split('_')
          const { data } = await this.currenciesService.find({
            $or: [{ code: type[0] }, { code: type[1] }]
          })

          const debitCurrency = data.find(e => e.code === type[0])
          const creditCurrency = data.find(e => e.code === type[1])

          return {
            _id: doc._id,
            type: doc.type,
            status: doc.status,
            rate: +doc.rate,
            createdAt: doc.createdAt,
            progress: +parseFloat(
              '' + (total / +doc.credit.amount) * 100
            ).toFixed(2),
            debit: {
              amount: +doc.debit.amount / 100,
              currency: {
                name: debitCurrency.name,
                code: debitCurrency.code,
                symbol: debitCurrency.symbol
              }
            },
            credit: {
              amount: +doc.credit.amount / 100,
              currency: {
                name: creditCurrency.name,
                code: creditCurrency.code,
                symbol: creditCurrency.symbol
              }
            },
            latestTransaction: lt && {
              ...lt,
              amount: +lt.amount / 100,
              user: '@' + lt.user?.username
            }
          }
        })
      )

      response.data = deals
      response.message = `${pluralize(
        this.name.toLowerCase(),
        response.data.length,
        true
      )} found`
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }
}
