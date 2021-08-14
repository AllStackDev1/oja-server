import {
  Get,
  Param,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException
} from '@nestjs/common'

import { JwtAuthGuard } from 'jwt-auth/jwt-auth.guard'
import { QueuesService } from './queues.service'
import { IDPayloadDto } from 'lib/misc.dto'

@UseGuards(JwtAuthGuard)
@Controller('queues')
export class QueuesController {
  constructor(private readonly service: QueuesService) {}

  /**
   * @description This method return all records
   * @returns HTTP response
   */
  @Get()
  public async findAll() {
    const result = await this.service.find({})
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Get(':id')
  public async findOne(@Param() params: IDPayloadDto) {
    const result = await this.service.findById(params.id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
