import { join } from 'path'
import { readFile } from 'fs'
import { load } from 'cheerio'
import { Logger } from 'winston'
import { decode } from 'js-base64'
import { google } from 'googleapis'
import { MailParser } from 'mailparser'
import { Inject, Injectable } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

const TOKEN_PATH = join(process.cwd(), '/gmail/token.json')

@Injectable()
export class GmailScrapperService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger
  ) {}

  __main__ = () => {
    // Load client secrets from a local file.
    readFile(
      join(process.cwd(), '/gmail/credentials.json'),
      (err, content: any) => {
        if (err) return this.logger.error(err)
        // Authorize a client with credentials, then call the Gmail API.
        this.authorize(JSON.parse(content), this.listMessages)
      }
    )
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   */
  private authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.web
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    )

    // Check if we have previously stored a token.
    readFile(TOKEN_PATH, (err, token: any) => {
      if (err) return this.logger.error(err)
      oAuth2Client.setCredentials(JSON.parse(token))
      callback(oAuth2Client)
    })
  }

  private listMessages = async auth => {
    try {
      const query = 'from:prince@zeedas.com in:inbox is:unread category:primary'
      const gmail = google.gmail({ version: 'v1', auth })
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query
      })

      if (!res.data.messages) return

      res.data.messages.forEach(({ id }) => {
        this.getMail(id, auth)
      })
    } catch (err) {
      this.logger.error(err.stack)
    }
  }

  private getMail = (msgId: string, auth) => {
    const gmail = google.gmail({ version: 'v1', auth })
    gmail.users.messages.get(
      {
        userId: 'me',
        id: msgId
      },
      (err, res) => {
        if (!err) {
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
              const name = target[0]
              const amount = parseFloat(target[1].replace(/,/g, ''))
              // TODO: call deals service for update
              console.log('name', name)
              console.log('amount', amount)
              try {
                await gmail.users.messages.modify({
                  id: msgId,
                  userId: 'me',
                  requestBody: { removeLabelIds: ['UNREAD'] }
                })
                this.logger.info(`Successfully marked email as read ${msgId}`)
              } catch (err) {
                this.logger.error(err)
              }
            }
          })

          parser.write(htmlBody)
          parser.end()
        }
      }
    )
  }
}
