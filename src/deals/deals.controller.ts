import {
  Get,
  Post,
  Body,
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
import { JwtAuthGuard } from 'auth/jwt-auth.guard'
import { IDPayloadDto, QueryDto } from 'lib/misc.dto'
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
   * @description
   * This method handles the http request for get:deals, it returns
   * deals with it latest transaction. The result also depends on the payload query
   * @typedef {string} DealStatusEnum
   * @enum {(DealStatusEnum)}
   * @param {DealStatusEnum} payload.status
   * @returns Response payload
   */
  @Get()
  async findByPayload(
    @Request() req: Record<string, UserDto>,
    @Query() payload: QueryDto
  ) {
    let query: any = JSON.parse(payload.q || '{}')
    if (!req.user.isAdmin) {
      query = { ...query, user: String(req.user._id) }
    }

    const result = await this.service.find(query)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Get(':id')
  async findById(@Param() params: IDPayloadDto) {
    const result = await this.service.findById(params.id)
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
