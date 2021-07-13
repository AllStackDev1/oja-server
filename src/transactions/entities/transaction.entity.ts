import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, ObjectId, Types } from 'mongoose'

export type TransactionDocument = Transaction & Document

@Schema({ versionKey: false, timestamps: true })
export class Transaction {
  @Prop({ required: true })
  fromAccountName: string

  @Prop({ required: true })
  toAccountName: string

  @Prop({ required: true })
  fromCountry: string

  @Prop({ required: true })
  toCountry: string

  @Prop({ required: true })
  fromAccountNumber: string

  // to account number may not be needed if swift code is presented
  toAccountNumber: string
  toSwiftCode: string

  @Prop({ required: true })
  fromBankName: string

  @Prop({ required: true })
  toBankName: string

  @Prop({ required: true, ref: 'User' })
  senderUser: ObjectId

  @Prop({ required: true, ref: 'User' })
  receiverUser: ObjectId

  @Prop({ required: true })
  sendingAmount: {
    actualAmount: Types.Decimal128
    exchangeAmount: Types.Decimal128
  }
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
