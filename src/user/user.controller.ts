import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryPayload } from './../interfaces'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   *
   * @description req.body.payload contains the fields required to create a user record
   * @param payload.firstName
   * @param payload.lastName
   * @param payload.userName
   * @param payload.email
   * @param payload.password
   * @param payload.address.country
   * @returns HTTP response
   */
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload)
  }

  /**
   *
   * @description Payload may be null it will fetch all user records
   * @param payload.email
   * @param payload.userName
   * @returns HTTP response
   */
  @Get()
  findByPayload(@Query() payload: QueryPayload) {
    return this.userService.find(payload)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
