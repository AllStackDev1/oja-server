import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CountriesService } from './countries.service'
import { CountriesController } from './countries.controller'
import { Country, CountrySchema } from './schemas/country.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService, MongooseModule]
})
export class CountriesModule {}
