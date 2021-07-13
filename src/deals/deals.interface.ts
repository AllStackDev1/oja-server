import { DefaultResponsePayload } from 'interface'
import { Document, Types, ObjectId } from 'mongoose'

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

export type DealStatus = DefaultResponsePayload

export interface DealWithData extends DefaultResponsePayload {
  deal?: IDeal
  deals?: IDeal[]
}
