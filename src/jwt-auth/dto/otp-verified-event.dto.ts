import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class OTPVerifiedEventDto {
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
