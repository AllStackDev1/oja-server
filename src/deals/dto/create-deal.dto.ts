import { ObjectId, Types } from 'mongoose'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmptyObject,
  ValidateNested
} from 'class-validator'

export class AccountDetails {
  @IsString()
  @IsNotEmpty()
  currency: string

  @IsString()
  @IsNotEmpty()
  bankName: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  swiftCode: string

  @IsString()
  @IsNotEmpty()
  accountName: string

  @IsString()
  @IsNotEmpty()
  accountNumber: string

  @IsNumber()
  @IsNotEmpty()
  amount: Types.Decimal128
}

export class CreateDealDto {
  @IsString()
  @IsOptional()
  user: ObjectId

  @IsNumber()
  @IsNotEmpty()
  rate: Types.Decimal128

  @IsNumber()
  @IsNotEmpty()
  charges: Types.Decimal128

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AccountDetails)
  debit: AccountDetails

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => AccountDetails)
  credit: AccountDetails
}
