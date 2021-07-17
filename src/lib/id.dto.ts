import { IsNotEmpty } from 'class-validator'
import { ObjectId } from 'mongoose'

export class IDPayloadDto {
  @IsNotEmpty()
  readonly id: ObjectId
}
