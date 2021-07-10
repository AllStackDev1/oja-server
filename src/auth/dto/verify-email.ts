import { IsString, IsNotEmpty } from 'class-validator'

export class VerifyEmailPayloadDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string
}
