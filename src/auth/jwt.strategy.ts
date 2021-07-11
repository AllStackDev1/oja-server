// dependencies
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// services
import { AuthService } from './auth.service'

// environment variables
import { secret } from 'app.environment'

// interfaces
import { JwtPayload } from 'interfaces'

// dto's
import { UserDto } from 'users/dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    })
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    const user = await this.authService.validateUser(payload)
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
