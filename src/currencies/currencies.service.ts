import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as pluralize from 'pluralize'

import { CreateCurrencyDto, UpdateCurrencyDto } from './dto'
import { CrudService } from 'lib/crud.service'
import { ICurrency, ResponsePayload } from 'lib/interfaces'

@Injectable()
export class CurrenciesService extends CrudService<
  ICurrency,
  CreateCurrencyDto,
  UpdateCurrencyDto
> {
  protected readonly name = 'Currency'

  constructor(
    @InjectModel('Currency')
    protected readonly model: Model<ICurrency>
  ) {
    super(model)
  }

  async find(payload: any): Promise<ResponsePayload<ICurrency[], string>> {
    let response: ResponsePayload<ICurrency[], string> = {
      success: true
    }
    try {
      response.data = await this.model
        .find(payload || {})
        .populate({ path: 'rates.currency', match: { status: true } })
        .lean()
      response.data.forEach(c => {
        c.rates = c.rates.filter(r => r.currency)
      })
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
