import {
  IsEmail,
  Matches,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength
} from 'class-validator'

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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak'
  })
  @IsNotEmpty()
  readonly password: string
}
