import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Controller
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { QueryPayload } from './../interfaces'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    return this.usersService.create(payload)
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
    return this.usersService.find(payload)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
