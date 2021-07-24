import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

import { CurrenciesService } from './currencies.service'
import { CurrenciesController } from './currencies.controller'
import { Currency, CurrencySchema } from './schemas/currency.schema'

@Module({
  imports: [
    MulterModule.register(),
    MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }])
  ],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService, MongooseModule]
})
export class CurrenciesModule {}
