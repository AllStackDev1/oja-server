import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { GatewayService } from './gateway.service'
import { GatewayController } from './gateway.controller'
import { PlaidGatewayStrategy } from './plaid.strategy'
import { Gateway, GatewaySchema } from './schemas/gateway.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gateway.name, schema: GatewaySchema }])
  ],
  controllers: [GatewayController],
  providers: [GatewayService, PlaidGatewayStrategy],
  exports: [GatewayService, MongooseModule]
})
export class GatewayModule {}
