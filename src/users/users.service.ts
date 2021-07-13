import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

import { QueryPayload } from 'interface'
import { IUser } from './users.interface'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>
  ) {}

  create = async (createUserDto: CreateUserDto) => {
    const message = 'User creation successful'
    let response = { success: true, message, user: null }
    try {
      response.user = await this.userModel.create(createUserDto)
    } catch (err) {
      response = { success: false, message: err.message, user: null }
    }
    return response
  }

  findOne = async (payload: any) => {
    let response = { success: true, message: null, user: null }
    try {
      response.user = await this.userModel.findOne(payload)
    } catch (err) {
      response = { success: false, message: err.message, user: null }
    }
    return response
  }

  findById = async (id: string | number) => {
    let response = { success: true, message: null, user: null }
    try {
      response.user = await this.userModel.findById(id)
    } catch (err) {
      response = { success: false, message: err.message, user: null }
    }
    return response
  }

  find = async (payload: QueryPayload) => {
    let response = { success: true, message: null, users: null }
    try {
      response.users = await this.userModel.find(payload || {})
    } catch (err) {
      response = { success: false, message: err.message, users: null }
    }
    return response
  }

  update = async (id: string | number, updateUserDto: UpdateUserDto) => {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true
    })
  }

  remove = async (id: string | number) => {
    return await this.userModel.findByIdAndRemove(id)
  }
}
