import { Module, forwardRef } from '@nestjs/common'
import { DealsModule } from 'deals/deals.module'

import { QueuesModule } from 'queues/queues.module'
import { QueuesService } from 'queues/queues.service'

import { GmailScrapperModule } from 'gmail-scrapper/gmail-scrapper.module'
import { GmailScrapperService } from 'gmail-scrapper/gmail-scrapper.service'

import { CronsService } from './cron.service'
@Module({
  imports: [QueuesModule, GmailScrapperModule, forwardRef(() => DealsModule)],
  providers: [CronsService, QueuesService, GmailScrapperService]
})
export class CronsModule {}
