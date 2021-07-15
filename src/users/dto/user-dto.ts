import { ObjectId } from 'mongoose'
import { Expose } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'

import { CreateUserDto } from './create-user.dto'
import { IAddress, StatusEnum } from 'lib/interfaces'

export class UserDto extends PartialType(CreateUserDto) {
  readonly _id: ObjectId

  readonly avatar: string

  readonly isAdmin: boolean

  readonly dateOfBirth: Date

  readonly address: IAddress

  readonly status: StatusEnum

  readonly isEmailVerified: boolean
}
