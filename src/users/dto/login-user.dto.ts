import { IsEmail, IsString, ValidateIf, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
  @ValidateIf(o => o.username === undefined)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string

  @ValidateIf(o => o.email === undefined)
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string
}
