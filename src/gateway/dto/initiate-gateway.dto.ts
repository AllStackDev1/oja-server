import { IsString, IsNotEmpty } from 'class-validator'
import { GatewayTypeEnum } from 'lib/interfaces'

export class InitiateGatewayDto {
  @IsNotEmpty()
  @IsString()
  readonly type: GatewayTypeEnum
}
