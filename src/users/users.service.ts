import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { GenericService } from 'lib/generic.service'

import { IUser } from 'lib/interfaces'

@Injectable()
export class UsersService extends GenericService<IUser> {
  constructor(
    @InjectModel('User')
    protected readonly userModel: Model<IUser>
  ) {
    super(userModel, 'user')
  }
}
