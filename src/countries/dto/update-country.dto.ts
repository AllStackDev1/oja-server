import { PartialType } from '@nestjs/mapped-types'
import { CreateCountryDto } from './create-country.dto'
import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator'

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly status: boolean
}
