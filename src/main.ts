import 'dotenv/config'
import helmet from 'helmet'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { port } from 'app.environment'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  )
  await app.listen(port)
  logger.log(`🪐🔥 App listening on port http://localhost:${port} 🪐🔥`)
}
bootstrap()
