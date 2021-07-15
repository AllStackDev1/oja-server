import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Request,
  UsePipes,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
  ValidationPipe
} from '@nestjs/common'

import { DealsService } from './deals.service'
import { CreateDealDto } from './dto/create-deal.dto'
import { UpdateDealDto } from './dto/update-deal.dto'
import { ObjectPayloadDto } from 'lib/interfaces'
import { JwtAuthGuard } from 'auth/jwt-auth.guard'
import { IDPayloadDto } from 'lib/id.dto'
import { UserDto } from 'users/dto'

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly service: DealsService) {}

  /**
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.user
   * @param payload.rate
   * @param payload.charges
   * @param payload.credit
   * @param payload.debit
   * @returns HTTP response
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(
    @Request() req: Record<string, UserDto>,
    @Body() payload: CreateDealDto
  ) {
    if (!payload.user) payload.user = req.user._id
    const result = await this.service.create(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  /**
   * @description Payload may be null it will fetch all user records
   * @param payload.email
   * @param payload.username
   * @returns HTTP response
   */
  @Get()
  async findByPayload(@Query() payload: ObjectPayloadDto) {
    const result = await this.service.find(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Get(':id')
  async findOne(@Param() params: IDPayloadDto) {
    const result = await this.service.findById(params.id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Patch(':id')
  async update(
    @Param() params: IDPayloadDto,
    @Body() updateDealDto: UpdateDealDto
  ) {
    const result = await this.service.update(params.id, updateDealDto)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Delete(':id')
  async remove(@Param() params: IDPayloadDto) {
    const result = await this.service.remove(params.id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
