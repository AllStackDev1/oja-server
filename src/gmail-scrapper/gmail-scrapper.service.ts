import { join } from 'path'
import { load } from 'cheerio'
import { Logger } from 'winston'
import { readFileSync } from 'fs'
import { decode } from 'js-base64'
import { google } from 'googleapis'
import { MailParser } from 'mailparser'
import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

interface IData {
  msgId: string
  name: string
  amount: number
}
@Injectable()
export class GmailScrapperService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger
  ) {}

  __main__ = async () => {
    try {
      const content: any = readFileSync(
        join(process.cwd(), '/gmail/credentials.json')
      )
      const auth = this.authorize(JSON.parse(content))
      const data = await this.listMessages(auth)
      return { auth, data }
    } catch (err) {
      this.logger.error(err)
      return
    }
  }

  private authorize = credentials => {
    const { client_secret, client_id, redirect_uris } = credentials.web
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    try {
      const token: any = readFileSync(join(process.cwd(), '/gmail/token.json'))
      oAuth2Client.setCredentials(JSON.parse(token))
      return oAuth2Client
    } catch (err) {
      this.logger.error(err)
      return
    }
  }

  private listMessages = async (auth): Promise<IData[]> => {
    try {
      const query = 'from:prince@zeedas.com in:inbox is:unread category:primary'
      const gmail = google.gmail({ version: 'v1', auth })
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query
      })

      if (!res.data.messages) return

      return Promise.all(
        res.data.messages.map(async ({ id }) => {
          return await Promise.resolve(
            new Promise((resolve, reject) => {
              this.getMail(id, auth, d => {
                if (!d) reject(null)
                resolve(d)
              })
            })
          )
        })
      )
    } catch (err) {
      this.logger.error(err.stack)
    }
  }

  private getMail = async (msgId: string, auth, cb) => {
    try {
      const gmail = google.gmail({ version: 'v1', auth })
      const res = await gmail.users.messages.get({ userId: 'me', id: msgId })
      const body = res.data.payload.parts[0].body.data
      const htmlBody = decode(body.replace(/-/g, '+').replace(/_/g, '/'))

      const parser = new MailParser()
      parser.on('end', (err, res) => {
        if (err) {
          this.logger.error(err)
          this.logger.error(err.stack)
        } else {
          this.logger.info(res)
        }
      })

      parser.on('data', async dat => {
        if (dat.type === 'text') {
          const $ = load(dat.textAsHtml)
          const target = $('p:contains(sent you)')
            .text()
            .split(' (C')[0]
            .split(' sent you $')
          cb({
            msgId,
            name: target[0],
            amount: parseFloat(target[1].replace(/,/g, ''))
          })
        }
      })

      parser.write(htmlBody)
      parser.end()
    } catch (err) {
      this.logger.error(err)
      this.logger.error(err.stack)
    }
  }

  markMessageRead = async (msgId: string, auth) => {
    try {
      const gmail = google.gmail({ version: 'v1', auth })
      await gmail.users.messages.modify({
        id: msgId,
        userId: 'me',
        requestBody: { removeLabelIds: ['UNREAD'] }
      })
      this.logger.info(`Successfully marked email as read ${msgId}`)
    } catch (err) {
      this.logger.error(err)
      this.logger.error(err.stack)
    }
  }
}
