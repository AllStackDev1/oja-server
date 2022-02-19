import { Document, Decimal128, ObjectId } from 'mongoose'

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
  isAdmin: boolean
  password: string
  lastName: string
  username: string
  firstName: string
  address: IAddress
  googleId?: string
  facebookId?: string
  dateOfBirth: Date
  status: StatusEnum
  phoneNumber: string
  twoFactorAuth: boolean
  isEmailVerified: boolean
  save(p?: any): Promise<any>
  comparePassword(p: string): boolean
  createdAt: Date
  updatedAt: Date
}

export interface IToken extends Document {
  user: IUser
  token: string
  refreshToken: string
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

export interface ICurrency extends Document {
  name: string
  code: string
  symbol: string
}

export interface IPhone extends Document {
  code: string
  placeholder: string
}

export interface IRate extends Document {
  name: string
  rate: Decimal128 | number
}

export interface ICountry extends Document {
  _id: ObjectId
  name: string
  code: string
  phone: IPhone
  rates: IRate[]
  status: boolean
  currency: ICurrency
}

export interface IAccountDetails {
  currencySymbol: string
  bankName: string
  swiftCode: string
  accountName: string
  accountNumber: string
  amount: Decimal128 | number
}

export enum TransactionTypeEnum {
  SENT = 'Sent',
  RECEIVED = 'Received'
}

export interface ITransaction extends Document {
  user: IUser
  amount: Decimal128 | number
  createdAt: string
  type: TransactionTypeEnum
}

export enum DealStatusEnum {
  COMPLETED = 'COMPLETED',
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING'
}

export interface IDeal extends Document {
  _id: ObjectId
  user: IUser
  type: string
  rate: Decimal128 | number
  transactionFee: Decimal128 | number
  settlementFee: Decimal128 | number
  debit: IAccountDetails
  credit: IAccountDetails
  status: DealStatusEnum
  transactions: [ITransaction]
  transaction: ITransaction
  createdAt: string
}

export interface IQueue extends Document {
  _id: ObjectId
  type: string
  deals: IDeal[]
  isProcessing: boolean
}

export enum GatewayTypeEnum {
  DWOLLA = 'DWOLLA',
  PLAID = 'PLAID',
  OKRA = 'OKRA'
}

export interface IAny {
  [key: string]: string
}
