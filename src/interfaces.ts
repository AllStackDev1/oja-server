export interface JwtPayload {
  username: string
}

export interface RegistrationStatus {
  success: boolean
  message: string
}

export interface LoginStatus {
  user: Record<string, undefined>
  expiresIn: number
  accessToken: string
}

export interface QueryPayload {
  [key: string]: string | number | boolean
}
