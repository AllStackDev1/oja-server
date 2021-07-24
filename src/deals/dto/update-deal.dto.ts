import {
  IsArray,
  IsString,
  IsDefined,
  IsOptional,
  ValidateNested
} from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'

import { DealStatusEnum } from 'lib/interfaces'
import { CreateDealDto } from './create-deal.dto'

export class UpdateDealDto extends PartialType(CreateDealDto) {
  @IsOptional()
  @IsDefined()
  @IsString()
  readonly status: DealStatusEnum
}
