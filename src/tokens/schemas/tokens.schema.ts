import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from 'users/schemas/user.schema'

export type TokenDocument = Token & Document

@Schema({ versionKey: false, timestamps: true })
export class Token {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User'
  })
  user: User

  @Prop({ required: true })
  value: string

  @Prop({ required: true })
  refreshKey: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)
