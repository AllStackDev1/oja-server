import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { dbUrl, dbName } from 'app.enviroment'
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      dbUrl + '/' + dbName + '?retryWrites=true&w=majority',
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      }
    ),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
