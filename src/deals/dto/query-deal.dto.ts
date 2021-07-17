import { IsString, IsDefined, IsOptional } from 'class-validator'
import { ObjectId } from 'mongoose'

import { DealStatusEnum } from 'lib/interfaces'

export class QueryDealDto {
  @IsOptional()
  @IsDefined()
  @IsString()
  readonly user: ObjectId

  @IsOptional()
  @IsDefined()
  @IsString()
  readonly status: DealStatusEnum
}
