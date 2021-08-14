import { IsNotEmpty, IsPhoneNumber } from 'class-validator'

export class ResendOtpPayloadDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phoneNumber: string
}
