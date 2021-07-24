import { Decimal128, ObjectId } from 'mongoose'
import {
  IsArray,
  IsString,
  IsNumber,
  IsDefined,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  ValidateNested
} from 'class-validator'
import { Type } from 'class-transformer'

export class RateDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly currency: ObjectId

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  readonly value: Decimal128 | number
}

export class CreateCurrencyDto {
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

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsOptional()
  flag: string

  @ValidateNested()
  @IsOptional()
  @IsArray()
  @Type(() => RateDto)
  readonly rates: RateDto

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly status: boolean
}
