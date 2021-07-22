import { Model, ObjectId } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as pluralize from 'pluralize'

import { IDeal, ResponsePayload, TransactionTypeEnum } from 'lib/interfaces'
import { CreateDealDto, UpdateDealDto } from './dto'
import { CrudService } from 'lib/crud.service'
import { CurrenciesService } from 'currencies/currencies.service'

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
    private readonly currenciesService: CurrenciesService
  ) {
    super(model)
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
          amount: +t.amount,
          user: '@' + t.user.username
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
        settlementFee: +doc.settlementFee,
        transactionFee: +doc.transactionFee,
        progress:
          Math.round(
            (total / +doc.credit.amount) * 100 * 100 + Number.EPSILON
          ) / 100,
        debit: {
          ...doc.debit,
          amount: +doc.debit.amount,
          currency: {
            name: debitCurrency.name,
            code: debitCurrency.code,
            symbol: debitCurrency.symbol
          }
        },
        credit: {
          ...doc.credit,
          amount: +doc.credit.amount,
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
            console.log(total)
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
            rate: +doc.rate,
            createdAt: doc.createdAt,
            progress:
              Math.round(
                (total / +doc.credit.amount) * 100 * 100 + Number.EPSILON
              ) / 100,
            debit: {
              amount: +doc.debit.amount,
              currency: {
                name: debitCurrency.name,
                code: debitCurrency.code,
                symbol: debitCurrency.symbol
              }
            },
            credit: {
              amount: +doc.credit.amount,
              currency: {
                name: creditCurrency.name,
                code: creditCurrency.code,
                symbol: creditCurrency.symbol
              }
            },
            latestTransaction: lt && {
              ...lt,
              amount: +lt.amount,
              user: '@' + lt.user.username
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
