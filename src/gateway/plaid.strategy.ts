import { Injectable } from '@nestjs/common'
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode
} from 'plaid'
import { plaidEnv, plaidClientId, plaidSecret } from 'app.environment'

@Injectable()
export class PlaidGatewayStrategy {
  private client: PlaidApi = null
  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[plaidEnv],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': plaidClientId,
          'PLAID-SECRET': plaidSecret,
          'Plaid-Version': '2020-09-14'
        }
      }
    })

    this.client = new PlaidApi(configuration)
  }

  createLinkToken = async (userId: string) => {
    try {
      const {
        data: { link_token: linkToken }
      } = await this.client.linkTokenCreate({
        user: {
          client_user_id: userId
        },
        client_name: "Oj'a",
        products: [Products.Auth, Products.Identity],
        country_codes: [
          CountryCode.Us,
          CountryCode.Gb,
          CountryCode.Ca,
          CountryCode.Ie,
          CountryCode.Fr,
          CountryCode.Es,
          CountryCode.Nl
        ],
        language: 'en'
      })
      return { linkToken }
    } catch (error) {
      const err = error?.response?.data || ' Unexpected Error Occurred'
      return err
    }
  }

  exchangePublicToken = async (publicToken: any) => {
    try {
      const {
        data: { access_token: accessToken, item_id: itemId }
      } = await this.client.itemPublicTokenExchange({
        public_token: publicToken
      })
      return { accessToken, itemId }
    } catch (error) {
      const err = error?.response?.data || ' Unexpected Error Occurred'
      return err
    }
  }

  authGet = async (accessToken: any) => {
    try {
      const { data } = await this.client.authGet({ access_token: accessToken })
      return data
    } catch (error) {
      const err = error?.response?.data || ' Unexpected Error Occurred'
      return err
    }
  }
}
