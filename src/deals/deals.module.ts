import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DealsService } from './deals.service'
import { DealsController } from './deals.controller'
import { Deal, DealSchema } from 'deals/schemas/deal.schema'
import { CurrenciesService } from 'currencies/currencies.service'
import { CurrenciesModule } from 'currencies/currencies.module'

@Module({
  imports: [
    CurrenciesModule,
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }])
  ],
  controllers: [DealsController],
  providers: [DealsService, CurrenciesService],
  exports: [DealsService]
})
export class DealsModule {}
