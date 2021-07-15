import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CrudService } from 'lib/crud.service'
import { CreateUserDto, UpdateUserDto } from './dto'
import { IUser } from 'lib/interfaces'

@Injectable()
export class UsersService extends CrudService<
  IUser,
  CreateUserDto,
  UpdateUserDto
> {
  protected readonly name = 'User'

  constructor(
    @InjectModel('User')
    protected readonly model: Model<IUser>
  ) {
    super(model)
  }
}
