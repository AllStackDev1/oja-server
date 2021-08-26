import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-facebook'

import { facebookId, facebookSecret, serverUrl } from 'app.environment'
import { UsersService } from 'users/users.service'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: facebookId,
      clientSecret: facebookSecret,
      callbackURL: serverUrl + '/auth/facebook/callback',
      scope: 'email',
      profileFields: ['id', 'email', 'name', 'picture.type(small)']
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ): Promise<any> {
    const { id, name, emails, photos } = profile
    const { data } = await this.usersService.findOne({
      $or: [{ facebookId: id }, { email: emails[0].value }]
    })
    if (data) {
      if (!data.facebookId && !data.avatar) {
        data.facebookId = id
        data.avatar = photos[0].value
        await data.save()
      }
      return data
    } else {
      return {
        facebookId: id,
        email: emails[0].value,
        avatar: photos[0].value,
        firstName: name.givenName,
        lastName: name.familyName
      }
    }
  }
}
