import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User, UserSchema, UserDocument } from './user.schema'
import { saltLength } from 'app.enviroment'

import * as _ from 'lodash'
import * as bcrypt from 'bcrypt'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema
          schema.pre<UserDocument>('save', function (this: UserDocument, next) {
            if (this.isModified('firstName') || this.isModified('lastName')) {
              this.firstName = _.upperFirst(this.firstName.toLowerCase())
              this.lastName = _.upperFirst(this.lastName.toLowerCase())
            }

            // encrypt password
            if (this.isModified('password')) {
              this.password = bcrypt.hashSync(
                this.password,
                bcrypt.genSaltSync(parseInt(saltLength))
              )
            }

            next()
          })

          /**
           * @summary method will remove the user password from the object body
           */
          schema.methods.toJSON = function () {
            return _.omit(this.toObject(), 'password')
          }
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
