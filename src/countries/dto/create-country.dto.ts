import { IsString, IsNotEmpty, IsDefined } from 'class-validator'

export class CreateCountryDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly dialCode: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly currency: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly placeholder: string

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly packageId: string
}
