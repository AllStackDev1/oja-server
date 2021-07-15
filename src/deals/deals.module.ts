import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DealsService } from './deals.service'
import { DealsController } from './deals.controller'
import { Deal, DealSchema } from 'deals/schemas/deal.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }])
  ],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService]
})
export class DealsModule {}
