import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

import { googleId, googleSecret, serverUrl } from 'app.environment'
import { UsersService } from 'users/users.service'

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: googleId,
      clientSecret: googleSecret,
      callbackURL: serverUrl + '/auth/google/callback',
      scope: ['email', 'profile']
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile
  ): Promise<any> {
    const { id, name, emails, photos } = profile
    const { data } = await this.usersService.findOne({
      $or: [{ googleId: id }, { email: emails[0].value }]
    })
    if (data) {
      if (!data.googleId && !data.avatar) {
        data.googleId = id
        data.avatar = photos[0].value
        await data.save()
      }
      return data
    } else {
      return {
        googleId: id,
        avatar: photos[0].value,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName
      }
    }
  }
}
