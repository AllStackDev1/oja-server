import { HttpModule, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TwilioModule } from 'nestjs-twilio'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { TermiiService } from './termii'
import { UserService } from 'user/user.service'
import { UserModule } from 'user/user.module'
import {
  expiresIn,
  secret,
  twilioAccSId,
  twilioAuthToken
} from 'app.environment'

@Module({
  imports: [
    UserModule,
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
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, TermiiService],
  exports: [PassportModule, JwtModule]
})
export class AuthModule {}
