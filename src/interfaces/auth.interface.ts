import { IUser } from './user.interface'

export interface JwtPayload {
  username: string
}

export interface RegistrationStatus {
  success: boolean
  message: string
  data?: IUser
  otpResponse?: string
}

export interface ITermiiVerifyOTP {
  pinId: string
  pin: string
}

export interface OtpVerificationStatus {
  success: boolean
  message: string
  user: IUser
  authToken: string
}

export interface ResendOtpStatus {
  success: boolean
  message: string
}
