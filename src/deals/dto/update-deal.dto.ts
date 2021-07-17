import {
  IsArray,
  IsString,
  IsDefined,
  IsOptional,
  ValidateNested
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'

import { DealStatusEnum } from 'lib/interfaces'
import { CreateDealDto } from './create-deal.dto'
import { CreateTransactionDto } from './create-transaction.dto'

export class UpdateDealDto extends PartialType(CreateDealDto) {
  @ValidateNested()
  @IsOptional()
  @IsDefined()
  @IsArray()
  @Type(() => CreateTransactionDto)
  readonly transactions: CreateTransactionDto

  @IsOptional()
  @IsDefined()
  @IsString()
  readonly status: DealStatusEnum
}
