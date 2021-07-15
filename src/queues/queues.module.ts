import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { QueuesService } from './queues.service'
import { QueuesController } from './queues.controller'
import { Queue, QueueSchema } from './schemas/queue.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema }])
  ],
  controllers: [QueuesController],
  providers: [QueuesService],
  exports: [QueuesService]
})
export class QueuesModule {}
