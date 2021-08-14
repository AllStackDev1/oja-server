import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Request,
  UseGuards,
  HttpStatus,
  Controller,
  HttpException
} from '@nestjs/common'

import { JwtAuthService } from './jwt-auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

import { CreateUserDto, LoginUserDto } from 'users/dto'
import {
  RegistrationStatus,
  VerifyOtpStatus,
  ResponsePayload
} from 'lib/interfaces'
import {
  VerifyOtpPayloadDto,
  ResendOtpPayloadDto,
  VerifyEmailPayloadDto
} from './dto'

@Controller('auth')
export class JwtAuthController {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  @Post('register')
  public async register(
    @Body() payload: CreateUserDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.jwtAuthService.register(
      payload
    )
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('verify-otp')
  public async verifyOtp(
    @Body() payload: VerifyOtpPayloadDto
  ): Promise<VerifyOtpStatus> {
    const result: VerifyOtpStatus = await this.jwtAuthService.verifyOtp(payload)

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('resend-otp')
  public async resendOtp(
    @Body() payload: ResendOtpPayloadDto
  ): Promise<ResponsePayload<any, string>> {
    const result = await this.jwtAuthService.resendOtp(payload)

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Patch('verify-email/:token')
  public async verifyEmail(
    @Param() params: VerifyEmailPayloadDto
  ): Promise<any> {
    const result = await this.jwtAuthService.verifyEmail(params.token)

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('login')
  public async login(@Body() payload: LoginUserDto): Promise<any> {
    const result = await this.jwtAuthService.validateUser(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.UNAUTHORIZED)
    }

    return result
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Request() req) {
    return { success: true, data: { user: req.user } }
  }
}
