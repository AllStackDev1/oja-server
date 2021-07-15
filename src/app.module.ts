// dependencies
import { Module } from '@nestjs/common'
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
import { AuthModule } from 'auth/auth.module'
import { UsersModule } from 'users/users.module'
import { DealsModule } from './deals/deals.module'
import { QueuesModule } from './queues/queues.module'
import { TransactionsModule } from 'transactions/transactions.module'

// environment variables
import {
  dbUrl,
  dbName,
  smtpUser,
  smtpPass,
  smtpPort,
  smtpHost
} from 'app.environment'
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DealsModule,
    QueuesModule,
    TransactionsModule,
    ScheduleModule.forRoot(),
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
    }),
    CountriesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
