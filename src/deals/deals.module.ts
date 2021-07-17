import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DealsService } from './deals.service'
import { DealsController } from './deals.controller'
import { Deal, DealSchema } from 'deals/schemas/deal.schema'
import { CountriesService } from 'countries/countries.service'
import { CountriesModule } from 'countries/countries.module'

@Module({
  imports: [
    CountriesModule,
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }])
  ],
  controllers: [DealsController],
  providers: [DealsService, CountriesService],
  exports: [DealsService]
})
export class DealsModule {}
