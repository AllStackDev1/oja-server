import { IsNumber, IsString, IsNotEmpty } from 'class-validator'
import { Decimal128, ObjectId } from 'mongoose'

import { TransactionTypeEnum } from 'lib/interfaces'

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  readonly user: ObjectId

  @IsNotEmpty()
  @IsNumber()
  readonly amount: Decimal128

  @IsNotEmpty()
  @IsString()
  readonly type: TransactionTypeEnum
}
