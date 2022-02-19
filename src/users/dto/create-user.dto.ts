import {
  IsEmail,
  Matches,
  IsObject,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  IsOptional,
  IsNotEmptyObject,
  ValidateNested,
  IsDefined,
  IsPostalCode
} from 'class-validator'
import { Type } from 'class-transformer'

export class Address {
  @IsString()
  @IsOptional()
  readonly street?: string

  @IsString()
  @IsOptional()
  readonly city?: string

  @IsOptional()
  @IsPostalCode()
  readonly postalCode?: string

  @IsString()
  @IsOptional()
  readonly state?: string

  @IsString()
  @IsNotEmpty()
  readonly country: string
}

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
  @IsOptional()
  readonly googleId: string

  @IsNotEmpty()
  @IsOptional()
  readonly facebookId: string

  @IsNotEmptyObject()
  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => Address)
  readonly address: Address

  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsOptional()
  readonly avatar?: string
}
