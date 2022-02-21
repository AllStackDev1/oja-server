// dependencies
import * as winston from 'winston'
import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { MailerModule } from '@nestjs-modules/mailer'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

// controller
import { AppController } from 'app.controller'

// services
import { AppService } from 'app.service'

// modules
import { UsersModule } from 'users/users.module'
import { CronsModule } from './cron/cron.module'
import { DealsModule } from './deals/deals.module'
import { QueuesModule } from './queues/queues.module'
import { TokensModule } from './tokens/tokens.module'
import { JwtAuthModule } from './jwt-auth/jwt-auth.module'
import { CurrenciesModule } from './currencies/currencies.module'
import { GoogleOauthModule } from './google-oauth/google-oauth.module'
import { FacebookOauthModule } from './facebook-oauth/facebook-oauth.module'
import { GmailScrapperModule } from './gmail-scrapper/gmail-scrapper.module'

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
    UsersModule,
    DealsModule,
    CronsModule,
    TokensModule,
    QueuesModule,
    JwtAuthModule,
    CurrenciesModule,
    GoogleOauthModule,
    FacebookOauthModule,
    GmailScrapperModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: dbUrl + '/' + dbName + '?retryWrites=true&w=majority',
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }),
    MailerModule.forRoot({
      transport: {
        secure: true,
        host: smtpHost,
        auth: { user: smtpPort, pass: smtpPass }
      },
      defaults: {
        from: `"Oj'a" ${smtpUser}`
      },
      // preview: ENV === 'DEV',
      template: {
        dir: process.cwd() + '/templates',
        adapter: new HandlebarsAdapter({
          // multiple: (a, b) => getFormattedMoney(a * b),
        }),
        options: {
          strict: true
        }
      }
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({
          dirname: './logs/debug/',
          filename: 'info.log',
          level: 'info'
        }),
        new winston.transports.File({
          dirname: './logs/error/',
          filename: 'error.log',
          level: 'error'
        })
      ]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
