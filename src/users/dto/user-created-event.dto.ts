import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserCreatedEvent {
  @IsEmail()
  @IsNotEmpty()
  username: string

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
