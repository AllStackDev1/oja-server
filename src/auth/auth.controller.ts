import {
  Post,
  Body,
  Param,
  Patch,
  HttpStatus,
  Controller,
  HttpException
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'user/dto/create-user.dto'
import { LoginUserDto } from 'user/dto/login-user.dto'
import {
  RegistrationStatus,
  VerifyOtpStatus,
  ResendOtpStatus
} from 'interfaces'
import { VerifyOtpPayloadDto } from './dto/verify-otp.dto'
import { ResendOtpPayloadDto } from './dto/resend-otp.dto'
import { VerifyEmailPayloadDto } from './dto/verify-email'

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
  ): Promise<ResendOtpStatus> {
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
  public async login(@Body() payload: LoginUserDto): Promise<ResendOtpStatus> {
    const result = await this.authService.login(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
