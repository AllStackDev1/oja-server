import { ObjectId } from 'mongoose'
import { IsString, IsDefined, IsNotEmpty } from 'class-validator'

export class CreateQueueDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsDefined()
  deals: ObjectId[]
}
