// dependencies
import { Injectable } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { InjectTwilio, TwilioClient } from 'nestjs-twilio'
import { MailerService } from '@nestjs-modules/mailer'
import { JwtService } from '@nestjs/jwt'

import {
  StatusEnum,
  JwtPayload,
  VerifyOtpStatus,
  ResponsePayload,
  RegistrationStatus
} from 'lib/interfaces'
import {
  VerifyOtpPayloadDto,
  ResendOtpPayloadDto,
  OTPVerifiedEventDto
} from './dto'
import { CreateUserDto, LoginUserDto, UserDto } from 'users/dto'
import { secret, expiresIn, clientUrl } from 'app.environment'
import { UsersService } from 'users/users.service'
import { TermiiService } from './termii.service'

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
      // check to see if email or username already exist
      const { data: foundUser } = await this.usersService.findOne({
        $or: [
          { email: payload.email },
          { username: payload.username },
          { phoneNumber: payload.phoneNumber }
        ]
      })
      if (foundUser) {
        throw new Error('Email or username, or phone number already in use')
      }
      const {
        success,
        data: newUser,
        message
      } = await this.usersService.create(payload)
      if (success) {
        const otpResponse = await this.termiiService.sendOtp(
          newUser.phoneNumber
        )
        response.data = newUser
        response.otpResponse = otpResponse
      } else {
        throw new Error(message)
      }
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
      const { data: user } = await this.usersService.findOne({
        phoneNumber: termiiResponse.msisdn
      })

      response.user = user
      // generate an auth token which will allow the user access into
      // the application
      response.authToken = this._createToken(response.user, payload.expiresIn)

      // To make sure that user only receive this once we check
      // if the user is already active, as this method wil be reused
      // for subsequent otp verifications
      if (response.user.status !== StatusEnum.ACTIVE) {
        response.user.status = StatusEnum.ACTIVE
        await response.user.save()
        // insatiate DTO class
        const phoneNumberVerifiedEvent = new OTPVerifiedEventDto()
        // set up object
        phoneNumberVerifiedEvent.email = response.user.email
        phoneNumberVerifiedEvent.fullName = [
          response.user.firstName,
          response.user.lastName
        ].join(' ')
        phoneNumberVerifiedEvent.link = `${clientUrl}/auth/verify-email/${response.authToken}`
        // emit phone number verified event
        this.eventEmitter.emit('otp.verified.event', phoneNumberVerifiedEvent)
      }
    } catch (e) {
      response.success = false
      response.message = e.response?.data
    }
    return response
  }

  async resendOtp(
    payload: ResendOtpPayloadDto
  ): Promise<ResponsePayload<any, string>> {
    let response: ResponsePayload<any, string> = {
      success: true,
      message: 'OTP sent successfully'
    }
    try {
      // check to see if phone number belongs to an existing user
      const { data: user } = await this.usersService.findOne({
        phoneNumber: payload.phoneNumber
      })
      if (!user) throw new Error('No user found')
      response.message = await this.termiiService.sendOtp(user.phoneNumber)
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async verifyEmail(payload: string): Promise<ResponsePayload<any, string>> {
    let response: ResponsePayload<any, string> = {
      success: true,
      message: 'Email verification successful'
    }
    try {
      // decode payload using jwt service decode
      const decoded: any = this.jwtService.decode(payload)
      // check to see if phone number belongs to an existing user
      const { data: user } = await this.usersService.findOne({
        email: decoded.username
      })
      if (!user) throw new Error('Unexpected error occurred')
      user.isEmailVerified = true
      // TODO: add email to mailing list if needed
      await user.save()
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  async validateUser(
    payload: LoginUserDto
  ): Promise<ResponsePayload<any, string>> {
    let response: ResponsePayload<any, string> = {
      success: true,
      message: 'User found'
    }
    try {
      // find user in db
      const { data: user } = await this.usersService.findOne({
        $or: [{ email: payload.email }, { username: payload.username }]
      })
      // if user exist and user password match
      if (user && user.comparePassword(payload.password)) {
        // response.data = this._createToken(user, expiresIn)
        response.data = await this.termiiService.sendOtp(user.phoneNumber)
      } else {
        throw new Error('Incorrect email or password')
      }
    } catch (err) {
      response = { success: false, message: err.message }
    }
    return response
  }

  private _createToken({ _id, username }: UserDto, exp = expiresIn): string {
    const A: JwtPayload = { sub: _id, username }
    const B = { secret, expiresIn: exp }
    return this.jwtService.sign(A, B).toString()
  }

  @OnEvent('otp.verified.event', { async: true })
  protected async handleOTPVerifiedEventDto(payload: OTPVerifiedEventDto) {
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
