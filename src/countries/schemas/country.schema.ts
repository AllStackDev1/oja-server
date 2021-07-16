import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Rate, RateSchema } from './rate.schema'
import { Currency, CurrencySchema } from './currency.schema'
import { Phone, PhoneSchema } from './phone.schema'

export type CountryDocument = Country & Document

@Schema({ versionKey: false, timestamps: true })
export class Country {
  @Prop({ unique: true, required: true })
  name: string

  @Prop({ unique: true, required: true })
  code: string

  @Prop({ type: CurrencySchema, required: true })
  currency: Currency

  @Prop({ type: PhoneSchema, required: true })
  phone: Phone

  @Prop({ type: [RateSchema], required: true })
  rates: Rate[]

  @Prop({ default: false })
  status: boolean
}

export const CountrySchema = SchemaFactory.createForClass(Country)
