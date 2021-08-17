import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CreateTokenDto } from './dto/create-token.dto'
import { UpdateTokenDto } from './dto/update-token.dto'

import { CrudService } from 'lib/crud.service'
import { UsersService } from 'users/users.service'

import { IToken } from 'lib/interfaces'

@Injectable()
export class TokensService extends CrudService<
  IToken,
  CreateTokenDto,
  UpdateTokenDto
> {
  protected readonly name = 'Deal'

  constructor(
    @InjectModel('Token')
    protected readonly model: Model<IToken>,
    private readonly usersService: UsersService
  ) {
    super(model)
  }
}
