import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { User } from 'users/schemas/user.schema'

export type DealDocument = Gateway & Document

@Schema({ versionKey: false, timestamps: true })
export class Gateway {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'User'
  })
  user: User

  @Prop({ type: {} })
  plaid: {
    itemId: string
    accessToken: string
  }

  @Prop({ type: {} })
  okra: {
    itemId: string
    accessToken: string
  }
}

export const GatewaySchema = SchemaFactory.createForClass(Gateway)
