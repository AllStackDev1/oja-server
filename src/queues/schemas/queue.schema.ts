import { Document, Schema as MongooseSchema } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { Deal } from 'deals/schemas/deal.schema'

export type QueueDocument = Queue & Document

@Schema({ versionKey: false, timestamps: false })
export class Queue {
  @Prop({ unique: true, required: true })
  type: string

  @Prop({ type: [MongooseSchema.Types.ObjectId], required: true, ref: 'Deal' })
  deals: Deal[]

  @Prop({ default: false })
  isProcessing: boolean
}

export const QueueSchema = SchemaFactory.createForClass(Queue)
