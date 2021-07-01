import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { QueryPayload } from 'interfaces'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './user.schema'
import { Model } from 'mongoose'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  create = async (createUserDto: CreateUserDto) => {
    return await this.userModel.create(createUserDto)
  }

  findAll = async () => {
    return await this.userModel.find()
  }

  findSome = async (payload: QueryPayload) => {
    return await this.userModel.find(payload)
  }

  findOne = async (payload: QueryPayload) => {
    return await this.userModel.findOne(payload)
  }

  findById = async (id: string | number) => {
    return await this.userModel.findById(id)
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
