import { IsString, IsNotEmpty } from 'class-validator'

export class IDPayloadDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string
}
