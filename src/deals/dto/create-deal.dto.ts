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

export class BankInfo {
  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly code: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly swiftCode: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly routingNumber: string
}

export class AccountDetails {
  @IsNotEmpty()
  @IsNumber()
  readonly amount: Decimal128 | number

  @IsNotEmptyObject()
  @ValidateNested()
  @IsDefined()
  @IsObject()
  @Type(() => BankInfo)
  readonly bank: BankInfo

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
  readonly rate: Decimal128 | number

  @IsNotEmpty()
  @IsString()
  readonly type: string

  @IsNotEmpty()
  @IsNumber()
  readonly transactionFee: Decimal128 | number

  @IsNotEmpty()
  @IsNumber()
  readonly settlementFee: Decimal128 | number

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
