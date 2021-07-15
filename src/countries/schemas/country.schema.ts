import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type CountryDocument = Country & Document

@Schema({ versionKey: false, timestamps: true })
export class Country {
  @Prop({ unique: true, required: true })
  dialCode: string

  @Prop({ unique: true, required: true })
  name: string

  @Prop({ unique: true, required: true })
  currency: string

  @Prop({ unique: true, required: true })
  placeholder: string

  @Prop({ unique: true, required: true })
  packageId: string

  @Prop({ default: false })
  status: boolean
}

export const CountrySchema = SchemaFactory.createForClass(Country)
