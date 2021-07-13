import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { DealStatus, DealWithData, IDeal } from './deals.interface'
import { QueryPayload } from 'interface'

import { CreateDealDto } from './dto/create-deal.dto'
import { UpdateDealDto } from './dto/update-deal.dto'

@Injectable()
export class DealsService {
  constructor(
    @InjectModel('Deal')
    private readonly dealModel: Model<IDeal>
  ) {}

  create = async (createDealDto: CreateDealDto): Promise<DealWithData> => {
    const message = 'Deal creation successful'
    let response: DealWithData = { success: true, message }
    try {
      response.deal = await this.dealModel.create(createDealDto)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  findOne = async (payload: QueryPayload): Promise<DealWithData> => {
    let response: DealWithData = { success: true }
    try {
      response.deal = await this.dealModel.findOne(payload)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  findById = async (id: string | number): Promise<DealWithData> => {
    let response: DealWithData = { success: true }
    try {
      response.deal = await this.dealModel.findById(id)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  find = async (payload: QueryPayload): Promise<DealWithData> => {
    let response: DealWithData = { success: true }
    try {
      response.deals = await this.dealModel.find(payload || {})
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }

  update = async (id: string | number, updateDealDto: UpdateDealDto) => {
    let response: DealWithData = { success: true }
    try {
      response.deal = await this.dealModel.findByIdAndUpdate(
        id,
        updateDealDto,
        {
          new: true
        }
      )
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }

  remove = async (id: string | number) => {
    let response: DealWithData = { success: true }
    try {
      response.deal = await this.dealModel.findByIdAndRemove(id, {
        new: true
      })
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }
}
