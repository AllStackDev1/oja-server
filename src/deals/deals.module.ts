import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DealsController } from './deals.controller'
import { Deal, DealSchema } from 'deals/schemas/deal.schema'

import { CurrenciesModule } from 'currencies/currencies.module'
import { QueuesModule } from 'queues/queues.module'

import { CurrenciesService } from 'currencies/currencies.service'
import { QueuesService } from 'queues/queues.service'
import { DealsService } from './deals.service'
import { GmailScrapperService } from 'gmail-scrapper/gmail-scrapper.service'

@Module({
  imports: [
    CurrenciesModule,
    forwardRef(() => QueuesModule),
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }])
  ],
  controllers: [DealsController],
  providers: [
    DealsService,
    QueuesService,
    CurrenciesService,
    GmailScrapperService
  ],
  exports: [DealsService, MongooseModule]
})
export class DealsModule {}
