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
import { LoginStatus, RegistrationStatus } from 'interfaces'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.firstName
   * @param payload.lastName
   * @param payload.userName
   * @param payload.email
   * @param payload.password
   * @param payload.address.country
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

  @Post('login')
  public async login(@Body() payload: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(payload)
  }
}
