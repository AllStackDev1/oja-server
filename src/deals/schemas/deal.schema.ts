import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from 'users/schemas/user.schema'
import { Details, DetailsSchema } from './details.schema'

export type DealDocument = Deal & Document

@Schema({ versionKey: false, timestamps: true })
export class Deal {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user: User

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  rate: Types.Decimal128

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  transactionFee: Types.Decimal128

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  settlementFee: Types.Decimal128

  @Prop({ type: DetailsSchema, required: true })
  debit: Details

  @Prop({ type: DetailsSchema, required: true })
  credit: Details
}

export const DealSchema = SchemaFactory.createForClass(Deal)
