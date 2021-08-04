import { IsString, IsDefined, IsOptional, IsNotEmpty } from 'class-validator'
import { ObjectId } from 'mongoose'

export class IDPayloadDto {
  @IsNotEmpty()
  readonly id: ObjectId
}

export class QueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  readonly q: string
}
