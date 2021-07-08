import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class PhoneNumberVerifiedEvent {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsString()
  @IsNotEmpty()
  link: string
}
