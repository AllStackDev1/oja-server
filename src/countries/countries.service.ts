import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CreateCountryDto, UpdateCountryDto } from './dto'
import { CrudService } from 'lib/crud.service'
import { ICountry } from 'lib/interfaces'

@Injectable()
export class CountriesService extends CrudService<
  ICountry,
  CreateCountryDto,
  UpdateCountryDto
> {
  protected readonly name = 'Country'

  constructor(
    @InjectModel('Country')
    protected readonly model: Model<ICountry>
  ) {
    super(model)
  }
}
