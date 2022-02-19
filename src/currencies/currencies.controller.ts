import {
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Controller,
  HttpException
} from '@nestjs/common'

import { JwtAuthGuard } from 'jwt-auth/jwt-auth.guard'

import { CurrenciesService } from './currencies.service'
import { CreateCurrencyDto } from './dto/create-currency.dto'
import { UpdateCurrencyDto } from './dto/update-currency.dto'
import { IDPayloadDto, QueryDto } from 'lib/misc.dto'

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateCurrencyDto) {
    const result = await this.service.create(body)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Get()
  async findByPayload(@Query() payload: QueryDto) {
    const result = await this.service.find(JSON.parse(payload.q || '{}'))
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param() params: IDPayloadDto) {
    const result = await this.service.findById(params.id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param() params: IDPayloadDto, @Body() body: UpdateCurrencyDto) {
    const result = await this.service.update(params.id, body)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param() params: IDPayloadDto) {
    const result = await this.service.remove(params.id)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
