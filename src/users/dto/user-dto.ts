import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IAddress, StatusEnum } from 'users/users.interface'
import { ObjectId } from 'mongoose'
export class UserDto extends PartialType(CreateUserDto) {
  readonly _id: ObjectId

  readonly avatar: string

  readonly dateOfBirth: Date

  readonly address: IAddress

  readonly status: StatusEnum

  readonly isEmailVerified: boolean
}
