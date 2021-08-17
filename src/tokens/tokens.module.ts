import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Token, TokenSchema } from './schemas/tokens.schema'
import { TokensService } from './tokens.service'

import { UsersModule } from 'users/users.module'
import { UsersService } from 'users/users.service'

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }])
  ],
  providers: [TokensService, UsersService],
  exports: [TokensService, MongooseModule]
})
export class TokensModule {}
