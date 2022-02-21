import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TwilioModule } from 'nestjs-twilio'

import { JwtAuthController } from './jwt-auth.controller'
import { JwtAuthService } from './jwt-auth.service'
import { JwtAuthStrategy } from './jwt-auth.strategy'

import { TermiiService } from 'lib/termii.service'
import { UsersService } from 'users/users.service'
import { UsersModule } from 'users/users.module'
import {
  expiresIn,
  secret,
  twilioAccSId,
  twilioAuthToken
} from 'app.environment'

@Module({
  imports: [
    UsersModule,
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false
    }),
    JwtModule.register({
      secret,
      signOptions: { expiresIn }
    }),
    TwilioModule.forRoot({
      accountSid: twilioAccSId,
      authToken: twilioAuthToken
    })
  ],
  controllers: [JwtAuthController],
  providers: [JwtAuthService, UsersService, JwtAuthStrategy, TermiiService],
  exports: [PassportModule, JwtModule]
})
export class JwtAuthModule {}
