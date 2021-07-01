import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'user/dto/create-user.dto'
import { UserDto } from 'user/dto/user-dto'
import { UserService } from 'user/user.service'
import { expiresIn } from 'app.enviroment'
import { LoginUserDto } from 'user/dto/login-user.dto'
import { JwtPayload, LoginStatus, RegistrationStatus } from 'interfaces'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered'
    }
    try {
      await this.userService.create(userDto)
    } catch (err) {
      status = {
        success: false,
        message: err
      }
    }
    return status
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    // find user in db
    const user = await this.userService.findOne({ email: loginUserDto.email })

    // generate and sign token
    const token = this._createToken(user)

    return { user, ...token }
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.userService.findOne({ email: payload.username })
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
    return user
  }

  private _createToken({ email }: UserDto): any {
    const user: JwtPayload = { username: email }
    const accessToken = this.jwtService.sign(user)
    return { expiresIn, accessToken }
  }
}
