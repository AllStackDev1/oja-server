import { Decimal128, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Currency } from './currency.schema'

@Schema({ versionKey: false, timestamps: true })
export class Rate {
  @Prop()
  _id: 0

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Currency'
  })
  currency: Currency

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  value: Decimal128 | number
}

export const RateSchema = SchemaFactory.createForClass(Rate)
