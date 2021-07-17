import { Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from 'users/schemas/user.schema'
import { TransactionTypeEnum } from 'lib/interfaces'

@Schema({ versionKey: false })
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user: User

  @Prop({ enum: TransactionTypeEnum, required: true })
  type: string

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  amount: Types.Decimal128

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
