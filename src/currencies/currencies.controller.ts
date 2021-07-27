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
  UploadedFile,
  HttpException,
  UseInterceptors,
  Request
} from '@nestjs/common'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'

import { JwtAuthGuard } from 'auth/jwt-auth.guard'
import { IDPayloadDto } from 'lib/id.dto'
import { ObjectPayloadDto } from 'lib/interfaces'
import { CurrenciesService } from './currencies.service'
import { CreateCurrencyDto } from './dto/create-currency.dto'
import { UpdateCurrencyDto } from './dto/update-currency.dto'
import { diskStorage } from 'multer'
import { FormDataBodyParserInterceptor } from 'lib/formdata-bodyparser'

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}
  /**
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.code
   * @param payload.name
   * @param payload.symbol
   * @param payload.flag
   * @param payload.rates
   * @returns HTTP response
   */
  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('flag', {
      storage: diskStorage({
        destination: './uploads/flags',
        filename: (req, file, cb) => {
          return cb(null, file.originalname)
        }
      })
    }),
    FormDataBodyParserInterceptor(['rates', 'status'])
  )
  async create(
    @Request() req,
    @UploadedFile() flag: Express.Multer.File,
    @Body() body: CreateCurrencyDto
  ) {
    if (!flag?.path) {
      throw new HttpException(
        'Flag image(svg) is required',
        HttpStatus.BAD_REQUEST
      )
    }
    body.flag = req.protocol + '://' + req.get('host') + '/' + flag.path
    const result = await this.service.create(body)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  /**
   * @description Payload may be null it will fetch all records
   * @param payload.status
   * @param payload.name
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

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('flag', {
      storage: diskStorage({
        destination: './uploads/flags',
        filename: (req, file, cb) => {
          return cb(null, file.originalname)
        }
      })
    }),
    FormDataBodyParserInterceptor(['rates', 'status'])
  )
  async update(
    @Request() req,
    @UploadedFile() flag: Express.Multer.File,
    @Param() params: IDPayloadDto,
    @Body() body: UpdateCurrencyDto
  ) {
    if (!flag?.path) {
      throw new HttpException(
        'Flag image(svg) is required',
        HttpStatus.BAD_REQUEST
      )
    }
    body.flag = req.protocol + '://' + req.get('host') + '/' + flag.path
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
