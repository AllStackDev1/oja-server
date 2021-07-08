import * as dotenv from 'dotenv'
dotenv.config()
import * as helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { port } from 'app.environment'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet())
  await app.listen(port)
  Logger.log(`App listening on port ${port}`)
  Logger.log(`App listening on port http://localhost:${port}`)
}
bootstrap()
