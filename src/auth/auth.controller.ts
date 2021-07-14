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

import { AuthService } from './auth.service'
import { CreateUserDto, LoginUserDto } from 'users/dto'
import { JwtAuthGuard } from './jwt-auth.guard'
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
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() payload: CreateUserDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('verify-otp')
  public async verifyOtp(
    @Body() payload: VerifyOtpPayloadDto
  ): Promise<VerifyOtpStatus> {
    const result: VerifyOtpStatus = await this.authService.verifyOtp(payload)

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('resend-otp')
  public async resendOtp(
    @Body() payload: ResendOtpPayloadDto
  ): Promise<ResponsePayload<any, string>> {
    const result = await this.authService.resendOtp(payload)

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Patch('verify-email/:token')
  public async verifyEmail(
    @Param() params: VerifyEmailPayloadDto
  ): Promise<any> {
    const result = await this.authService.verifyEmail(params.token)

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('login')
  public async login(@Body() payload: LoginUserDto): Promise<any> {
    const result = await this.authService.validateUser(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.UNAUTHORIZED)
    }

    return result
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Request() req) {
    return req.user
  }
}
