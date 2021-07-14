import { Document, Types, ObjectId } from 'mongoose'

export interface IAddress {
  street: string
  city: string
  state: string
  country: string
}

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface IUser extends Document {
  _id: ObjectId
  email: string
  avatar: string
  status: StatusEnum
  password: string
  lastName: string
  username: string
  firstName: string
  address: IAddress
  dateOfBirth: Date
  phoneNumber: string
  isEmailVerified: boolean
  save(p?: any): Promise<any>
  comparePassword(p: string): boolean
}

export interface GetUserByPayloadStatus {
  user: Record<string, undefined>
  expiresIn: number
  accessToken: string
}

export interface ResponsePayload<T, X> {
  success: boolean
  message?: X
  data?: T
}

export interface ObjectPayloadDto {
  [key: string]: string | number | boolean
}

export interface JwtPayload {
  sub: any
  username: string
}

export interface RegistrationStatus extends ResponsePayload<any, any> {
  data?: IUser
  otpResponse?: Record<string, string>
}

export interface ITermiiVerifyOTP {
  pinId: string
  code: string
}

export interface VerifyOtpStatus extends ResponsePayload<any, any> {
  user?: IUser
  authToken?: string
}

export interface IAccountDetails {
  currency: string
  bankName: string
  swiftCode: string
  accountName: string
  accountNumber: string
  amount: Types.Decimal128
}

export interface IDeal extends Document {
  user: ObjectId
  rate: Types.Decimal128
  charges: Types.Decimal128
  debitDetails: IAccountDetails
  creditDetails: IAccountDetails
}
