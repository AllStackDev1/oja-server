// dependencies
import { HttpService, Injectable } from '@nestjs/common'

// environment variables
import { termiiKey, termiiId } from 'app.environment'

// interfaces
import { ITermiiVerifyOTP } from 'auth/auth.interface'

@Injectable()
export class TermiiService {
  private _url: string
  private _headers: Record<string, Array<string>>
  constructor(private httpService: HttpService) {
    this._url = 'https://termii.com/api/sms/otp'
    this._headers = { 'Content-Type': ['application/json', 'application/json'] }
  }

  /**
   * @summary function to send otp
   * @param to Phone number to receive otp.
   */
  async sendOtp(to: string) {
    const response = await this.httpService
      .post(
        this._url + '/send',
        JSON.stringify({
          api_key: termiiKey,
          message_type: 'NUMERIC',
          to,
          from: termiiId,
          channel: 'generic',
          pin_attempts: 4,
          pin_time_to_live: 15,
          pin_length: 6,
          pin_placeholder: '< 1234 >',
          message_text: 'Your one time pin is < 1234 >',
          pin_type: 'NUMERIC'
        }),
        {
          headers: this._headers
        }
      )
      .toPromise()
    return response.data
  }

  /**
   * @summary function to verify otp
   * @param payload.pinId  pin identifer
   * @param payload.code pin code
   */
  async verifyOtp(payload: ITermiiVerifyOTP) {
    const response = await this.httpService
      .post(
        this._url + '/verify',
        JSON.stringify({
          api_key: termiiKey,
          pin_id: payload.pinId,
          pin: payload.code
        }),
        {
          headers: this._headers
        }
      )
      .toPromise()

    return response.data
  }
}
