import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UsersService } from 'users/users.service'
import { JwtPayload } from 'lib/interfaces'
import { secret } from 'app.environment'
import { UserDto } from 'users/dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret
    })
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    const { data } = await this.usersService.findById(payload.sub)

    return data
  }
}
