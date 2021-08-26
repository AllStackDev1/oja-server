import { ObjectId } from 'mongoose'
import { Type } from 'class-transformer'
import {
  IsObject,
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested
} from 'class-validator'

export class PlaidDto {
  @IsNotEmpty()
  @IsString()
  readonly itemId: string

  @IsNotEmpty()
  @IsString()
  readonly accessToken: string
}

export class CreateGatewayDto {
  @IsString()
  user: ObjectId

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => PlaidDto)
  readonly plaid?: PlaidDto

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => PlaidDto)
  readonly okra?: PlaidDto
}
