// dependencies
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// services
import { UsersService } from 'users/users.service'

// environment variables
import { secret } from 'app.environment'

// interfaces
import { JwtPayload } from 'auth/auth.interface'

// dto's
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
    const { user } = await this.usersService.findById(payload.sub)

    return user
  }
}
