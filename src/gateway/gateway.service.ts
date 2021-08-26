import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CrudService } from 'lib/crud.service'
import { IGateway } from 'lib/interfaces'
import { CreateGatewayDto } from './dto/create-gateway.dto'
import { UpdateGatewayDto } from './dto/update-gateway.dto'

@Injectable()
export class GatewayService extends CrudService<
  IGateway,
  CreateGatewayDto,
  UpdateGatewayDto
> {
  protected readonly name = 'Gateway'

  constructor(
    @InjectModel('Gateway')
    protected readonly model: Model<IGateway>
  ) {
    super(model)
  }
}
