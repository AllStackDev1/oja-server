// dependencies
import { HttpModule, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TwilioModule } from 'nestjs-twilio'

// controllers
import { AuthController } from './auth.controller'

// services
import { AuthService } from './auth.service'
import { TermiiService } from './termii.service'
import { UsersService } from 'users/users.service'

// module
import { UsersModule } from 'users/users.module'

// lib
import { JwtStrategy } from './jwt.strategy'

// environment variables
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
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, TermiiService],
  exports: [PassportModule, JwtModule]
})
export class AuthModule {}
