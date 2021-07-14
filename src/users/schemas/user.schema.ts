import * as _ from 'lodash'
import * as bcrypt from 'bcrypt'
import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { saltLength } from 'app.environment'
import { StatusEnum } from 'lib/interfaces'

export type UserDocument = User & Document

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop({
    trim: true,
    unique: true,
    required: true,
    lowercase: true
  })
  username: string

  @Prop({
    trim: true,
    unique: true,
    required: true,
    lowercase: true
  })
  email: string

  @Prop({ minlength: 8, required: true })
  password: string

  @Prop({
    trim: true,
    unique: true,
    required: true
  })
  phoneNumber: string

  @Prop({ type: {}, required: true })
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

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.INACTIVE })
  status: string

  @Prop({ default: false })
  isEmailVerified: boolean
}

const schema = SchemaFactory.createForClass(User)

schema.pre<UserDocument>('save', function (this: UserDocument, next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.firstName = _.upperFirst(this.firstName.toLowerCase())
    this.lastName = _.upperFirst(this.lastName.toLowerCase())
  }

  // encrypt password
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(
      this.password,
      bcrypt.genSaltSync(parseInt(saltLength))
    )
  }

  next()
})

/**
 * @summary method will remove the user password from the object body
 */
schema.methods.toJSON = function () {
  return _.omit(this.toObject(), 'password')
}

// schema method for comparing password
schema.methods.comparePassword = function (this: UserDocument, password) {
  return bcrypt.compareSync(password, this.password)
}

export const UserSchema = schema
