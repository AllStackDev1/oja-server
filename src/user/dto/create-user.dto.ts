import {
  IsEmail,
  Matches,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsPhoneNumber
} from 'class-validator'
import { IAddress } from 'interfaces'

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  readonly firstName: string

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  readonly lastName: string

  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  @IsNotEmpty()
  readonly password: string

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phoneNumber: string

  @IsNotEmpty()
  readonly address: IAddress

  @IsNotEmpty()
  readonly userName: string
}
