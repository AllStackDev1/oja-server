export interface IAddress {
  street: string
  city: string
  state: string
  country: string
}

export interface IUser extends Document {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  phoneNumber: string
  address: IAddress
  avatar: string
  dateOfBirth: Date
  status: string
  comparePassword(p: string): boolean
}

export interface JwtPayload {
  username: string
}

export interface RegistrationStatus {
  success: boolean
  message: string
  data?: IUser
}

export interface LoginStatus {
  user: Record<string, undefined>
  expiresIn: number
  accessToken: string
}

export interface GetUserByPayloadStatus {
  user: Record<string, undefined>
  expiresIn: number
  accessToken: string
}

export interface QueryPayload {
  [key: string]: string | number | boolean
}
