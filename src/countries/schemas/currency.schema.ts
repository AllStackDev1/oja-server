import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, timestamps: false })
export class Currency {
  @Prop()
  _id: 0

  @Prop({ required: true })
  code: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  symbol: string
}

export const CurrencySchema = SchemaFactory.createForClass(Currency)
