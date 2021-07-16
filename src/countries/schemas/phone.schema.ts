import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, timestamps: false })
export class Phone {
  @Prop()
  _id: 0

  @Prop({ required: true })
  code: string

  @Prop({ required: true })
  placeholder: string
}

export const PhoneSchema = SchemaFactory.createForClass(Phone)
