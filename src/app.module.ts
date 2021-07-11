// dependencies
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

// controller
import { AppController } from 'app.controller'

// services
import { AppService } from 'app.service'

// modules
import { AuthModule } from 'auth/auth.module'
import { TransactionsModule } from 'transactions/transactions.module'
import { UsersModule } from 'users/users.module'

// environment variables
import {
  dbUrl,
  dbName,
  smtpUser,
  smtpPass,
  smtpPort,
  smtpHost
} from 'app.environment'

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TransactionsModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: dbUrl + '/' + dbName + '?retryWrites=true&w=majority',
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
    }),
    MailerModule.forRoot({
      transport: {
        host: smtpHost,
        port: smtpPort,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass }
      },
      defaults: {
        from: `"Oj'a" ${smtpUser}`
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
