import { Type } from 'class-transformer'
import { Decimal128 } from 'mongoose'
import {
  IsArray,
  IsString,
  IsNumber,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsObject
} from 'class-validator'

export class RateDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly name: string

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  readonly rate: Decimal128
}

export class PhoneDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly code: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly placeholder: string
}

export class CurrencyDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly code: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly symbol: string
}

export class CreateCountryDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly code: string

  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => PhoneDto)
  readonly phone: PhoneDto

  @ValidateNested()
  @IsDefined()
  @IsArray()
  @Type(() => RateDto)
  readonly rates: RateDto

  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => CurrencyDto)
  readonly currency: CurrencyDto
}
