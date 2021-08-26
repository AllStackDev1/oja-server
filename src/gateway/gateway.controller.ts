import {
  Get,
  Post,
  Body,
  Query,
  Request,
  UseGuards,
  HttpStatus,
  Controller,
  HttpException
} from '@nestjs/common'
import { GatewayService } from './gateway.service'
import { PlaidGatewayStrategy } from './plaid.strategy'
import { JwtAuthGuard } from 'jwt-auth/jwt-auth.guard'
import { UserDto } from 'users/dto'
import { InitiateGatewayDto } from './dto/initiate-gateway.dto'
import { GatewayTypeEnum } from 'lib/interfaces'

@Controller('gateway')
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly plaidGatewayStrategy: PlaidGatewayStrategy
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/initiate')
  async initiate(
    @Request() req: Record<string, UserDto>,
    @Query() payload: InitiateGatewayDto
  ) {
    const result = { success: true, message: null, data: null }
    if (payload.type === GatewayTypeEnum.PLAID) {
      const plaidResponse = await this.plaidGatewayStrategy.createLinkToken(
        String(req.user._id)
      )
      if (plaidResponse.linkToken) {
        result.data = plaidResponse.linkToken
      } else result.success = false
    } else if (payload.type === GatewayTypeEnum.OKRA) {
      //
    } else {
      throw new HttpException('Unknown gateway type', HttpStatus.BAD_REQUEST)
    }

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Post('/validated')
  async validated(
    @Request() req: Record<string, UserDto>,
    @Body() payload: any
  ) {
    const result = { success: true, message: null, data: null }
    if (payload.type === GatewayTypeEnum.PLAID) {
      const plaidResponse = await this.plaidGatewayStrategy.exchangePublicToken(
        payload.publicToken
      )
      if (plaidResponse.accessToken && plaidResponse.itemId) {
        const { data, message } = await this.gatewayService.create({
          user: req.user._id,
          plaid: plaidResponse
        })
        result.message = message
        result.data = data
      } else result.success = false
    } else if (payload.type === GatewayTypeEnum.OKRA) {
      //
    } else {
      throw new HttpException('Unknown gateway type', HttpStatus.BAD_REQUEST)
    }

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Post('/authenticate')
  async authenticate(
    @Request() req: Record<string, UserDto>,
    @Body() payload: any
  ) {
    const result = { success: true, message: null, data: null }
    if (payload.type === GatewayTypeEnum.PLAID) {
      const plaidResponse = await this.plaidGatewayStrategy.exchangePublicToken(
        payload.publicToken
      )
      if (plaidResponse.accessToken && plaidResponse.itemId) {
        const { data, message } = await this.gatewayService.create({
          user: req.user._id,
          plaid: plaidResponse
        })
        result.message = message
        result.data = data
      } else result.success = false
    } else if (payload.type === GatewayTypeEnum.OKRA) {
      //
    } else {
      throw new HttpException('Unknown gateway type', HttpStatus.BAD_REQUEST)
    }

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  // @Get(':id')
  // return this.gatewayService.create(createGatewayDto)
  // findOne(@Param('id') id: string) {
  //   return this.gatewayService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGatewayDto: any) {
  //   return this.gatewayService.update(+id, updateGatewayDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gatewayService.remove(+id)
  // }
}
