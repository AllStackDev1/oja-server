import { IUser } from './user.interface'

export interface JwtPayload {
  username: string
}

export interface RegistrationStatus {
  success: boolean
  message: string
  data?: IUser
  otpResponse?: Record<string, string>
}

export interface ITermiiVerifyOTP {
  pinId: string
  code: string
}

export interface VerifyOtpStatus {
  success: boolean
  message: string
  user?: IUser
  authToken?: string
}

export interface ResendOtpStatus {
  success: boolean
  message: string
}
