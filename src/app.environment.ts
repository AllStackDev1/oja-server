export const NODE_ENV = process.env.NODE_ENV || 'DEV'
export const port = process.env.PORT || 3000

export const clientUrl = process.env[`${NODE_ENV}_CLIENT_URL`]
export const serverUrl = process.env[`${NODE_ENV}_SERVER_URL`]

export const dbUrl = process.env[`${NODE_ENV}_DATABASE_URL`]
export const dbName = process.env[`${NODE_ENV}_DATABASE_NAME`]

export const saltLength = process.env[`${NODE_ENV}_SALT_LENGTH`]
export const secret = process.env[`${NODE_ENV}_SECRET`]
export const expiresIn = process.env[`${NODE_ENV}_EXPIRES_IN`]

export const smtpPass = process.env[`${NODE_ENV}_SMTP_PASS`]
export const smtpUser = process.env[`${NODE_ENV}_SMTP_USER`]
export const smtpHost = process.env[`${NODE_ENV}_SMTP_HOST`]
export const smtpPort = process.env[`${NODE_ENV}_SMTP_PORT`]

export const twilioPhoneNo = process.env[`${NODE_ENV}_TWILIO_PHONE_NO`]
export const twilioAuthToken = process.env[`${NODE_ENV}_TWILIO_AUTH_TOKEN`]
export const twilioAccSId = process.env[`${NODE_ENV}_TWILIO_ACCOUNT_SID`]
export const twilioVerSId =
  process.env[`${NODE_ENV}_TWILIO_VERIFICATION_SERVICE_SID`]

export const termiiKey = process.env[`${NODE_ENV}_TERMII_KEY`]
export const termiiId = process.env[`${NODE_ENV}_TERMII_SENDER_ID`]

export const googleId = process.env[`${NODE_ENV}_GOOGLE_ID`]
export const googleSecret = process.env[`${NODE_ENV}_GOOGLE_SECRET`]
export const googleServiceClientEmail =
  process.env[`${NODE_ENV}_GOOGLE_SERVICE_CLIENT_EMAIL`]
export const googleServicePrivateKey =
  process.env[`${NODE_ENV}_GOOGLE_SERVICE_PRIVATE_KEY`]

export const facebookId = process.env[`${NODE_ENV}_FACEBOOK_ID`]
export const facebookSecret = process.env[`${NODE_ENV}_FACEBOOK_SECRET`]
