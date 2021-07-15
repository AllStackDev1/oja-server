import { Types, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, timestamps: false })
export class Details {
  @Prop()
  _id: 0

  @Prop()
  swiftCode: string

  @Prop({ required: true })
  currency: string

  @Prop({ required: true })
  bankName: string

  @Prop({ required: true })
  accountName: string

  @Prop({ required: true })
  accountNumber: string

  @Prop({ type: MongooseSchema.Types.Decimal128, required: true })
  amount: Types.Decimal128
}

export const DetailsSchema = SchemaFactory.createForClass(Details)
