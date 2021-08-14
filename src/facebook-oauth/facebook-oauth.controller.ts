/* eslint-disable @typescript-eslint/no-unused-vars */
declare const Buffer
import {
  Get,
  Res,
  Req,
  UseGuards,
  HttpStatus,
  Controller
} from '@nestjs/common'
import { FacebookOauthGuard } from './facebook-oauth.guard'
import { JwtAuthService } from 'jwt-auth/jwt-auth.service'
import { TermiiService } from 'lib/termii.service'
import { StatusEnum } from 'lib/interfaces'
import { clientUrl } from 'app.environment'

@Controller('auth/facebook')
export class FacebookOauthController {
  constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly termiiService: TermiiService
  ) {}

  @Get()
  @UseGuards(FacebookOauthGuard)
  async facebookAuth() {
    return HttpStatus.OK
  }

  @Get('callback')
  @UseGuards(FacebookOauthGuard)
  async facebookAuthRedirect(
    @Req() req: Record<string, any>,
    @Res() res
  ): Promise<void> {
    let data: any = ''
    if (req.user.username) {
      // if user opt for 2FA or if user has yet to verified phone number
      if (req.user.twoFactorAuth || req.user.status !== StatusEnum.ACTIVE) {
        const otpResponse = await this.termiiService.sendOtp(
          req.user.phoneNumber
        )
        data = { otpResponse }
      } else {
        const authToken = this.jwtAuthService._createToken(req.user)
        data = { authToken }
      }
      data = new Buffer.from(JSON.stringify(data)).toString('base64')
      res.redirect(`${clientUrl}/auth/social/success/${data}`)
    } else {
      data = new Buffer.from(JSON.stringify(req.user)).toString('base64')
      res.redirect(`${clientUrl}/auth/register/${data}`)
    }
  }
}
