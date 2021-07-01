import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  })
  email: string

  @Prop({ minlength: 8, required: true })
  password: string

  @Prop({ required: true })
  phoneNumber: string

  @Prop({
    type: [{ country: { type: String, required: true } }]
  })
  address: {
    street: string
    city: string
    state: string
    country: string
  }

  @Prop()
  avatar: string

  @Prop()
  dateOfBirth: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
