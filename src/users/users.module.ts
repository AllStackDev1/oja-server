import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

// services
import { UsersService } from './users.service'

// controllers
import { UsersController } from './users.controller'

// entity
import { User, UserSchema } from 'users/entities/user.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule]
})
export class UsersModule {}
