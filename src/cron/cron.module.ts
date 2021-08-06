import { Module, forwardRef } from '@nestjs/common'
import { DealsModule } from 'deals/deals.module'

import { QueuesModule } from 'queues/queues.module'
import { QueuesService } from 'queues/queues.service'
import { CronsService } from './cron.service'

@Module({
  imports: [QueuesModule, forwardRef(() => DealsModule)],
  providers: [CronsService, QueuesService]
})
export class CronsModule {}
