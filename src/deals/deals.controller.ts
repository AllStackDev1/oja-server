import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Request,
  UseGuards,
  Controller,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { DealsService } from './deals.service'

import { CreateDealDto } from './dto/create-deal.dto'
import { UpdateDealDto } from './dto/update-deal.dto'

import { ObjectPayloadDto } from 'lib/interfaces'

import { JwtAuthGuard } from 'auth/jwt-auth.guard'
import { UserDto } from 'users/dto'

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  /**
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.user
   * @param payload.rate
   * @param payload.charges
   * @param payload.creditDetails
   * @param payload.debitDetails
   * @returns HTTP response
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  public async create(
    @Request() req: Record<string, UserDto>,
    @Body() payload: CreateDealDto
  ) {
    if (!payload.user) payload.user = req.user._id
    const result = await this.dealsService.create(payload)
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
  public async findByPayload(@Query() payload: ObjectPayloadDto) {
    const result = await this.dealsService.find(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const result = await this.dealsService.findById(id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateDealDto: UpdateDealDto
  ) {
    const result = await this.dealsService.update(id, updateDealDto)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    const result = await this.dealsService.remove(id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
