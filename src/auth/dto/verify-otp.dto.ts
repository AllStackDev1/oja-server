import {
  IsString,
  IsPhoneNumber,
  IsOptional,
  IsNotEmpty
} from 'class-validator'

export class VerifyOtpPayloadDto {
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  readonly to: string

  @IsString()
  @IsNotEmpty()
  readonly code: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly pinId: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly expiresIn: string
}
