import { ResponsePayload } from 'lib/interfaces'
import { Model } from 'mongoose'

export class GenericService<U> {
  constructor(
    private readonly _model: Model<U>,
    private readonly _name: string
  ) {}

  async create<T>(payload: T): Promise<ResponsePayload<U, string>> {
    let response: ResponsePayload<U, string> = {
      success: true,
      message: `${this._name} creation successful`
    }
    try {
      response.data = await this._model.create(payload)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async findOne<T>(payload: T): Promise<ResponsePayload<U, string>> {
    let response: ResponsePayload<U, string> = {
      success: true,
      message: `${this._name} found`
    }
    try {
      response.data = await this._model.findOne(payload)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async findById(id: string | number): Promise<ResponsePayload<U, string>> {
    let response: ResponsePayload<U, string> = {
      success: true,
      message: `${this._name} found`
    }
    try {
      response.data = await this._model.findById(id)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async find<T>(payload: T): Promise<ResponsePayload<U[], string>> {
    let response: ResponsePayload<U[], string> = {
      success: true
    }
    try {
      response.data = await this._model.find(payload || {})
      response.message = `${response.data.length} ${this._name} found`
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async update<T>(
    id: string | number,
    payloadDto: T
  ): Promise<ResponsePayload<U, string>> {
    let response: ResponsePayload<U, string> = {
      success: true,
      message: `${this._name} updated successfully`
    }
    try {
      response.data = await this._model.findByIdAndUpdate(id, payloadDto, {
        new: true
      })
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }

  async remove(id: string | number): Promise<ResponsePayload<U, string>> {
    let response: ResponsePayload<U, string> = {
      success: true,
      message: `${this._name} deleted successfully`
    }
    try {
      response.data = await this._model.findByIdAndRemove(id, {
        new: true
      })
    } catch (err) {
      response = { success: false, message: err.message }
    }

    return response
  }
}
