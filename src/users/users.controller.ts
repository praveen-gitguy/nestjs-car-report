import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceprot';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  create(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.create(body.email, body.password);
  }

  @Get('/users')
  find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get('/users/:id')
  findUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch('/users/:id')
  findByIdAndUpdate(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete('/users/:id')
  findByIdAndDelete(@Param('id') id: string) {
    this.usersService.remove(id);
  }
}
