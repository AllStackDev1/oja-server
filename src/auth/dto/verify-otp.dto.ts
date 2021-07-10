import { IsString, IsPhoneNumber } from 'class-validator'

export class VerifyOtpPayloadDto {
  // @IsString()
  // @IsPhoneNumber()
  // readonly to: string

  @IsString()
  readonly code: string

  @IsString()
  readonly pinId: string

  readonly expiresIn: string
}
