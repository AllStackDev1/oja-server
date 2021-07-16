import { Decimal128, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, timestamps: true })
export class Rate {
  @Prop()
  _id: 0

  @Prop({ required: true })
  name: string

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  rate: Decimal128
}

export const RateSchema = SchemaFactory.createForClass(Rate)
