import { Model, ObjectId } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as pluralize from 'pluralize'

import { CountriesService } from 'countries/countries.service'
import {
  IActiveDealsLatestTransaction,
  IDeal,
  ResponsePayload,
  TransactionTypeEnum
} from 'lib/interfaces'
import { CreateDealDto, UpdateDealDto } from './dto'
import { CrudService } from 'lib/crud.service'

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
    private readonly countriesService: CountriesService
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
      const { data } = await this.countriesService.find({
        $or: [
          { 'currency.symbol': doc.debit.currencySymbol },
          { 'currency.symbol': doc.credit.currencySymbol }
        ]
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

      response.data = {
        _id: doc._id,
        rate: +doc.rate,
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
          currencyName: data.find(
            e => e.currency.symbol === doc.debit.currencySymbol
          ).currency.name
        },
        credit: {
          ...doc.credit,
          amount: +doc.credit.amount,
          currencyName: data.find(
            e => e.currency.symbol === doc.credit.currencySymbol
          ).currency.name
        }
      }
      response.message = `${this.name} found`
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async find(payload: any): Promise<ResponsePayload<any[], string>> {
    let response: ResponsePayload<IActiveDealsLatestTransaction[], string> = {
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
          const { data } = await this.countriesService.find({
            $or: [
              { 'currency.symbol': doc.debit.currencySymbol },
              { 'currency.symbol': doc.credit.currencySymbol }
            ]
          })
          return {
            _id: doc._id,
            createdAt: doc.createdAt,
            progress:
              Math.round(
                (total / +doc.credit.amount) * 100 * 100 + Number.EPSILON
              ) / 100,
            debit: {
              amount: +doc.debit.amount,
              currencyName: data.find(
                e => e.currency.symbol === doc.debit.currencySymbol
              ).currency.name,
              currencySymbol: doc.debit.currencySymbol
            },
            credit: {
              amount: +doc.credit.amount,
              currencyName: data.find(
                e => e.currency.symbol === doc.credit.currencySymbol
              ).currency.name,
              currencySymbol: doc.credit.currencySymbol
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
