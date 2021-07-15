import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, timestamps: false })
export class Address {
  @Prop()
  _id: 0

  @Prop({ trim: true })
  street: string

  @Prop({ trim: true })
  city: string

  @Prop({ trim: true })
  state: string

  @Prop({ trim: true, required: true })
  country: string
}

export const AddressSchema = SchemaFactory.createForClass(Address)
