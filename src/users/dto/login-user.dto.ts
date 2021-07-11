import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly password: string
}
