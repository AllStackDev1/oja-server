import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ versionKey: false, timestamps: false })
export class Bank {
  @Prop()
  _id: 0

  @Prop({ required: true })
  name: string

  @Prop()
  code: string

  @Prop()
  swiftCode: string

  @Prop()
  routingNumber: string
}

export const BankSchema = SchemaFactory.createForClass(Bank)
