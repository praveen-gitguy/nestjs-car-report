import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findById(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = (await user).id;
    return user;
  }

  @Post('/signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/users')
  find(): Promise<User[]> {
    return this.usersService.find();
  }

  @Get('/users/:id')
  findUser(@Param('id') id: string): Promise<User[]> {
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
