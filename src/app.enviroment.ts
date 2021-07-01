export const nodeEnv = process.env.NODE_ENV
export const dbUrl = process.env[`${nodeEnv}_DATABASE_URL`]
export const dbName = process.env[`${nodeEnv}_DATABASE_NAME`]
export const saltLength = process.env[`${nodeEnv}_SALT_LENGTH`]
export const secret = process.env[`${nodeEnv}_SECRET`]
export const expiresIn = process.env[`${nodeEnv}_EXPIRES_IN`]
