import { Model } from 'mongoose'
import { ResponsePayload } from 'lib/interfaces'
import * as pluralize from 'pluralize'

export abstract class CrudService<M, C, U> {
  protected readonly name: string

  constructor(protected readonly model: Model<M>) {}

  async create(payload: C): Promise<ResponsePayload<M, string>> {
    let response: ResponsePayload<M, string> = {
      success: true,
      message: `${this.name} creation successful`
    }
    try {
      response.data = await this.model.create(payload)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async findOne(payload: any): Promise<ResponsePayload<M, string>> {
    let response: ResponsePayload<M, string> = {
      success: true,
      message: `${this.name} found`
    }
    try {
      response.data = await this.model.findOne(payload)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async findById(id: string | number): Promise<ResponsePayload<M, string>> {
    let response: ResponsePayload<M, string> = {
      success: true,
      message: `${this.name} found`
    }
    try {
      response.data = await this.model.findById(id)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async find(payload: any): Promise<ResponsePayload<M[], string>> {
    let response: ResponsePayload<M[], string> = {
      success: true
    }
    try {
      response.data = await this.model.find(payload || {})
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

  async update(
    id: string | number,
    payload: U
  ): Promise<ResponsePayload<M, string>> {
    let response: ResponsePayload<M, string> = {
      success: true,
      message: `${this.name} updated successfully`
    }
    try {
      response.data = await this.model.findByIdAndUpdate(id, payload, {
        new: true
      })
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }

  async remove(id: string | number): Promise<ResponsePayload<M, string>> {
    let response: ResponsePayload<M, string> = {
      success: true,
      message: `${this.name} deleted successfully`
    }
    try {
      response.data = await this.model.findByIdAndRemove(id, {
        new: true
      })
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }
}
