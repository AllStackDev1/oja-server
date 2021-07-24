import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { QueuesService } from './queues.service'
import { DealsService } from 'deals/deals.service'

import { QueuesController } from './queues.controller'
import { Queue, QueueSchema } from './schemas/queue.schema'

import { DealsModule } from 'deals/deals.module'
import { CurrenciesModule } from 'currencies/currencies.module'
import { CurrenciesService } from 'currencies/currencies.service'

@Module({
  imports: [
    CurrenciesModule,
    forwardRef(() => DealsModule),
    MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema }])
  ],
  controllers: [QueuesController],
  providers: [QueuesService, DealsService, CurrenciesService],
  exports: [QueuesService, MongooseModule]
})
export class QueuesModule {}
