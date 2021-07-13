import { DefaultResponsePayload } from 'interface'
import { IUser } from 'users/users.interface'

export interface QueryPayload {
  [key: string]: string | number | boolean
}

export interface JwtPayload {
  sub: any
  username: string
}

export interface RegistrationStatus extends DefaultResponsePayload {
  data?: IUser
  otpResponse?: Record<string, string>
}

export interface ITermiiVerifyOTP {
  pinId: string
  code: string
}

export interface VerifyOtpStatus extends DefaultResponsePayload {
  user?: IUser
  authToken?: string
}

export type ResendOtpStatus = DefaultResponsePayload
