import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CreateDealDto, UpdateDealDto } from './dto'
import { CrudService } from 'lib/crud.service'
import { IDeal } from 'lib/interfaces'

@Injectable()
export class DealsService extends CrudService<
  IDeal,
  CreateDealDto,
  UpdateDealDto
> {
  protected readonly name = 'Deal'

  constructor(
    @InjectModel('Deal')
    protected readonly model: Model<IDeal>
  ) {
    super(model)
  }
}
