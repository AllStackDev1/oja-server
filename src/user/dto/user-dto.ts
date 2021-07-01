import { IsNotEmpty, IsEmail, IsMobilePhone } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

export class UserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  firstName: string

  @IsNotEmpty()
  lastName: string

  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  password: string

  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string

  avatar: string

  dateOfBirth: Date

  @IsNotEmpty()
  address: {
    street: string
    city: string
    state: string
    country: string
  }
}
