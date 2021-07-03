import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { port } from 'app.environment'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port)
  Logger.log(`App listening on port ${port}`)
  Logger.log(`App listening on port http://localhost:${port}`)
}
bootstrap()
