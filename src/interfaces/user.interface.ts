export interface IAddress {
  street: string
  city: string
  state: string
  country: string
}

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface IUser extends Document {
  email: string
  avatar: string
  status: StatusEnum
  password: string
  lastName: string
  userName: string
  firstName: string
  address: IAddress
  dateOfBirth: Date
  phoneNumber: string
  isEmailVerified: boolean
  save(p?: any): void
  comparePassword(p: string): boolean
}

export interface GetUserByPayloadStatus {
  user: Record<string, undefined>
  expiresIn: number
  accessToken: string
}
