import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { IDeal } from 'lib/interfaces'

import { GenericService } from 'lib/generic.service'

@Injectable()
export class DealsService extends GenericService<IDeal> {
  constructor(
    @InjectModel('Deal')
    protected readonly dealModel: Model<IDeal>
  ) {
    super(dealModel, 'deal')
  }
}
