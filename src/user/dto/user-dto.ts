import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IAddress } from 'interfaces'
export class UserDto extends PartialType(CreateUserDto) {
  readonly avatar: string

  readonly dateOfBirth: Date

  readonly address: IAddress

  readonly status: string
}
