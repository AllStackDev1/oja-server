import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from 'users/schemas/user.schema'

export type DealDocument = Deal & Document

const AccountDetails = {
  swiftCode: String,
  currency: { type: String, required: true },
  bankName: { type: String, required: true },
  accountName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Types.Decimal128, required: true }
}

@Schema({ versionKey: false, timestamps: true })
export class Deal {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user: User

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  rate: Types.Decimal128

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  charges: Types.Decimal128

  @Prop(raw(AccountDetails))
  debit: Record<string, any>

  @Prop(raw(AccountDetails))
  credit: Record<string, any>
}

export const DealSchema = SchemaFactory.createForClass(Deal)
