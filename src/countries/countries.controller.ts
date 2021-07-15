import {
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  Controller,
  HttpStatus,
  HttpException,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from 'auth/jwt-auth.guard'

import { IDPayloadDto } from 'lib/id.dto'
import { ObjectPayloadDto } from 'lib/interfaces'
import { CountriesService } from './countries.service'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'

@Controller('countries')
export class CountriesController {
  constructor(private readonly service: CountriesService) {}

  /**
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.name
   * @param payload.currency
   * @param payload.dialCode
   * @param payload.placeholder
   * @returns HTTP response
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateCountryDto) {
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
  async update(
    @Param() params: IDPayloadDto,
    @Body() updateDealDto: UpdateCountryDto
  ) {
    const result = await this.service.update(params.id, updateDealDto)
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
