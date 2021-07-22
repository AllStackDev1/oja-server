import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Rate, RateSchema } from './rate.schema'

export type CurrencyDocument = Currency & Document

@Schema({ versionKey: false, timestamps: true })
export class Currency {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  code: string

  @Prop({ required: true })
  symbol: string

  @Prop({ required: true })
  flag: string

  @Prop({ type: [RateSchema], required: true })
  rates: Rate[]

  @Prop({ default: false })
  status: boolean
}

export const CurrencySchema = SchemaFactory.createForClass(Currency)
