// dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { InjectTwilio, TwilioClient } from 'nestjs-twilio'
import { MailerService } from '@nestjs-modules/mailer'
import { JwtService } from '@nestjs/jwt'

// services
import { UsersService } from 'users/users.service'
import { TermiiService } from './termii.service'

// dto's
import { CreateUserDto, LoginUserDto, UserDto } from 'users/dto'
import { VerifyOtpPayloadDto, ResendOtpPayloadDto } from './dto'

// environment variables
import { secret, expiresIn, clientUrl } from 'app.environment'

// interfaces
import {
  JwtPayload,
  VerifyOtpStatus,
  RegistrationStatus,
  ResendOtpStatus,
  StatusEnum
} from 'interfaces'

// events
import { PhoneNumberVerifiedEvent } from 'event'

@Injectable()
export class AuthService {
  constructor(
    @InjectTwilio() private readonly twilioClient: TwilioClient,
    private readonly mailerService: MailerService,
    private readonly eventEmitter: EventEmitter2,
    private readonly termiiService: TermiiService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(payload: CreateUserDto): Promise<RegistrationStatus> {
    let response: RegistrationStatus = {
      success: true,
      message: 'Account creation successful'
    }
    try {
      // check to see if email already exist
      let user = await this.usersService.findOne({ email: payload.email })
      if (user) throw new Error('Email already registered')
      user = await this.usersService.create(payload)
      const otpResponse = await this.termiiService.sendOtp(user.phoneNumber)
      response.data = user
      response.otpResponse = otpResponse
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async verifyOtp(payload: VerifyOtpPayloadDto): Promise<VerifyOtpStatus> {
    const response: VerifyOtpStatus = {
      success: true,
      message: 'OTP Verification successful',
      user: null,
      authToken: null
    }
    try {
      // const twilioResponse = await this.twilioClient.verify
      //   .services(twilioVerSId)
      //   .verificationChecks.create(payload)
      // if (twilioResponse.status !== 'approved') {
      //   throw new Error('Could not verify code')
      // }
      // twilioResponse.to
      const termiiResponse = await this.termiiService.verifyOtp(payload)

      // find a user with the phone number
      response.user = await this.usersService.findOne({
        phoneNumber: termiiResponse.msisdn
      })

      // generate an auth token which will allow the user access into
      // the application
      const { accessToken } = this._createToken(
        response.user,
        payload.expiresIn
      )

      // add user and auth token to response data object
      response.authToken = accessToken

      // To make sure that user only receive this once we check
      // if the user is already active, as this method wil be reused
      // for subsequent otp verifications
      if (response.user.status !== StatusEnum.ACTIVE) {
        response.user.status = StatusEnum.ACTIVE
        await response.user.save()
        // insatiate DTO class
        const phoneNumberVerifiedEvent = new PhoneNumberVerifiedEvent()
        // set up object
        phoneNumberVerifiedEvent.email = response.user.email
        phoneNumberVerifiedEvent.fullName = [
          response.user.firstName,
          response.user.lastModified
        ].join(' ')
        phoneNumberVerifiedEvent.link = `${clientUrl}/auth/verify-email/${accessToken}`
        // emit phone number verified event
        this.eventEmitter.emit(
          'phone.number.verified.event',
          phoneNumberVerifiedEvent
        )
      }
    } catch (e) {
      response.success = false
      response.message = e.response?.data
    }
    return response
  }

  async resendOtp(payload: ResendOtpPayloadDto): Promise<ResendOtpStatus> {
    let response: ResendOtpStatus = { success: true, message: null }
    try {
      // check to see if phone number belongs to an existing user
      const user = await this.usersService.findOne({
        phoneNumber: payload.phoneNumber
      })
      if (!user) throw new Error('No user found')
      response.message = await this.termiiService.sendOtp(user.phoneNumber)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async verifyEmail(payload: string): Promise<any> {
    let response = { success: true, message: 'Email verification successful' }
    try {
      // decode payload using jwt service decode
      const decoded: any = this.jwtService.decode(payload)
      // check to see if phone number belongs to an existing user
      const user = await this.usersService.findOne({ email: decoded.username })
      if (!user) throw new Error('Unexpected error occurred')
      user.isEmailVerified = true
      // TODO: add email to mailing list if needed
      await user.save()
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findOne({ email: payload.username })
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
    return user
  }

  async login(payload: LoginUserDto): Promise<ResendOtpStatus> {
    let response: ResendOtpStatus = { success: true, message: null }
    try {
      const incorrect = 'The email or password provide is incorrect'
      // find user in db
      const user = await this.usersService.findOne({ email: payload.email })
      // user not found
      if (!user) throw new Error(incorrect)
      // check user provided password
      const isMatch = user.comparePassword(payload.password)
      if (!isMatch) throw new Error(incorrect)

      response.message = await this.termiiService.sendOtp(user.phoneNumber)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  private _createToken({ email }: UserDto, exp = expiresIn): any {
    const user: JwtPayload = { username: email }
    const accessToken = this.jwtService
      .sign(user, { secret, expiresIn: exp })
      .toString()
    return { expiresIn, accessToken }
  }

  @OnEvent('phone.number.verified.event', { async: true })
  private async handlePhoneNumberVerifiedEvent(
    payload: PhoneNumberVerifiedEvent
  ) {
    try {
      const response = await this.mailerService.sendMail({
        to: payload.email,
        subject: 'Account Registration Successful ✔',
        template: './register',
        context: {
          subject: 'Account Registration Successful ✔',
          link: payload.link,
          fullName: payload.fullName
        }
      })
      // log success verification email sent to user
      console.log(response)
    } catch (err) {
      // log error in sending verification email
      console.log(err)
    }
  }
}
