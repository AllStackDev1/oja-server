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

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto
    )
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }
    return result
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto)
  }
}
