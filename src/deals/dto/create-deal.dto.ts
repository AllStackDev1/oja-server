import { ObjectId, Decimal128 } from 'mongoose'
import { Type } from 'class-transformer'
import {
  IsObject,
  IsString,
  IsNumber,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject
} from 'class-validator'

export class AccountDetails {
  @IsNotEmpty()
  @IsNumber()
  readonly amount: Decimal128

  @IsNotEmpty()
  @IsString()
  readonly currencySymbol: string

  @IsNotEmpty()
  @IsString()
  readonly bankName: string

  @IsOptional()
  @IsString()
  readonly swiftCode: string

  @IsNotEmpty()
  @IsString()
  readonly accountName: string

  @IsNotEmpty()
  @IsString()
  readonly accountNumber: string
}

export class CreateDealDto {
  @IsOptional()
  @IsString()
  user: ObjectId

  @IsNotEmpty()
  @IsNumber()
  readonly rate: Decimal128

  @IsNotEmpty()
  @IsNumber()
  readonly transactionFee: Decimal128

  @IsNotEmpty()
  @IsNumber()
  readonly settlementFee: Decimal128

  @IsNotEmptyObject()
  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => AccountDetails)
  readonly debit: AccountDetails

  @IsNotEmptyObject()
  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => AccountDetails)
  readonly credit: AccountDetails
}
