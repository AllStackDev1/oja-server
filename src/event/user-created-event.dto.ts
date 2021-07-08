import { IsNotEmpty, IsPhoneNumber } from 'class-validator'

export default class UserCreatedEvent {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string
}
