import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { IUser, QueryPayload } from 'interfaces'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Model } from 'mongoose'

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>
  ) {}

  create = async (createUserDto: CreateUserDto) => {
    return await this.userModel.create(createUserDto)
  }

  findOne = async (payload: QueryPayload) => {
    return await this.userModel.findOne(payload)
  }

  findById = async (id: string | number) => {
    return await this.userModel.findById(id)
  }

  find = async (payload: QueryPayload) => {
    return await this.userModel.find(payload || {})
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
