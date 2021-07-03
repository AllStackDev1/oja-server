import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { JwtService } from '@nestjs/jwt'

import { CreateUserDto } from 'user/dto/create-user.dto'
import { UserDto } from 'user/dto/user-dto'
import { UserService } from 'user/user.service'
import { secret, expiresIn, clientUrl } from 'app.environment'
import { LoginUserDto } from 'user/dto/login-user.dto'
import { JwtPayload, LoginStatus, RegistrationStatus } from 'interfaces'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { UserCreatedEvent } from 'user/dto/user-created-event.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let response: RegistrationStatus = {
      success: true,
      message: 'user registered successfully'
    }
    try {
      // check to see if email already exist
      const user = await this.userService.findOne({ email: userDto.email })
      if (user) throw new Error('Email already registered')
      response.data = await this.userService.create(userDto)
      // generate token for email verification
      const { accessToken } = this._createToken(response.data)
      const userCreatedEvent = new UserCreatedEvent()
      userCreatedEvent.userName = response.data.userName
      userCreatedEvent.email = response.data.email
      userCreatedEvent.fullName =
        response.data.firstName + ' ' + response.data.lastName
      userCreatedEvent.link = `${clientUrl}/auth/verify/${accessToken}`
      // call user created event which sends verification email
      this.eventEmitter.emit('user.created', userCreatedEvent)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const payloadError = {
      mgs: 'The email or password provide is incorrect',
      status: HttpStatus.BAD_REQUEST
    }
    // find user in db
    const user = await this.userService.findOne({ email: loginUserDto.email })
    // user not found
    if (!user) {
      throw new HttpException(payloadError.mgs, payloadError.status)
    }
    // check user provided password
    const isMatch = user.comparePassword(loginUserDto.password)
    if (!isMatch) {
      throw new HttpException(payloadError.mgs, payloadError.status)
    }
    // check to see if account is activated
    if (user.status === 'INACTIVE') {
      throw new HttpException(
        'Account inactive, please activate',
        payloadError.status
      )
    }

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

  private _createToken({ email }: UserDto, exp = expiresIn): any {
    const user: JwtPayload = { username: email }
    const accessToken = this.jwtService
      .sign(user, { secret, expiresIn: exp })
      .toString()
    return { expiresIn, accessToken }
  }

  @OnEvent('user.created', { async: true })
  private handleUserCreatedEvent(payload: UserCreatedEvent) {
    this.mailerService
      .sendMail({
        to: payload.email,
        // from:'',
        subject: 'Account Registration Successful ✔',
        template: './register',
        context: {
          link: payload.link,
          fullName: payload.fullName
        }
      })
      .then(success => {
        // log success verification email sent to user
        console.log(success)
      })
      .catch(err => {
        // log error in sending verification email
        console.log(err)
      })
  }
}
