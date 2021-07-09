import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description req.body.payload contains the fields required to create a user record
   * @returns HTTP response
   */
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

  /**
   * @description req.body.payload contains the fields required to create a user record
   * @returns HTTP response
   */
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

  /**
   * @description req.body.payload contains the fields required to create a user record
   * @returns HTTP response
   */
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

  @Post('login')
  public async login(@Body() payload: LoginUserDto): Promise<ResendOtpStatus> {
    const result = await this.authService.login(payload)
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }
}
