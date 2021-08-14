import { JwtModule } from '@nestjs/jwt'
import { HttpModule, Module } from '@nestjs/common'

import { FacebookOauthController } from './facebook-oauth.controller'
import { FacebookStrategy } from './facebook-oauth.strategy'
import { JwtAuthService } from 'jwt-auth/jwt-auth.service'
import { UsersService } from 'users/users.service'
import { TermiiService } from 'lib/termii.service'
import { UsersModule } from 'users/users.module'

import { secret, expiresIn } from 'app.environment'

@Module({
  imports: [
    UsersModule,
    HttpModule,
    JwtModule.register({
      secret,
      signOptions: { expiresIn }
    })
  ],
  controllers: [FacebookOauthController],
  providers: [FacebookStrategy, UsersService, JwtAuthService, TermiiService]
})
export class FacebookOauthModule {}
