import { Module } from '@nestjs/common'
import { DealsModule } from 'deals/deals.module'
import { GmailScrapperService } from './gmail-scrapper.service'

@Module({
  imports: [DealsModule],
  providers: [GmailScrapperService]
})
export class GmailScrapperModule {}
