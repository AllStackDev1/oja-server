import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Controller,
  HttpException,
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common'

import { CreateUserDto, UpdateUserDto, UserDto } from './dto'
import { JwtAuthGuard } from 'auth/jwt-auth.guard'
import { ObjectPayloadDto } from 'lib/interfaces'
import { UsersService } from './users.service'
import { IDPayloadDto } from 'lib/id.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  /**
   *
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.firstName
   * @param payload.lastName
   * @param payload.username
   * @param payload.email
   * @param payload.password
   * @param payload.address.country
   * @returns HTTP response
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: Record<string, UserDto>,
    @Body() dto: CreateUserDto
  ) {
    if (!req.user.isAdmin) {
      throw new HttpException(
        'You are not authorized to perform this action',
        HttpStatus.FORBIDDEN
      )
    }
    const result = await this.service.create(dto)
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
  @UseGuards(JwtAuthGuard)
  @Get()
  async findByPayload(@Query() payload: ObjectPayloadDto) {
    const result = await this.service.find(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Get('count')
  async CountByPayload() {
    const result = await this.service.find({})
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return { ...result, count: result.data.length, data: null }
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
  async update(@Param() params: IDPayloadDto, @Body() dto: UpdateUserDto) {
    const result = await this.service.update(params.id, dto)
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
