import { Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BankSchema, Bank } from './bank.schema'

@Schema({ versionKey: false, timestamps: false })
export class Details {
  @Prop()
  _id: 0

  @Prop({
    type: BankSchema,
    required: true
  })
  bank: Bank

  @Prop({ required: true })
  accountName: string

  @Prop({ required: true })
  accountNumber: string

  @Prop({
    type: MongooseSchema.Types.Decimal128,
    required: true
  })
  amount: Types.Decimal128
}

export const DetailsSchema = SchemaFactory.createForClass(Details)
