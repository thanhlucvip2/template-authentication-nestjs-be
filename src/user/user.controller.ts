import { UserRegisterDto, UserLoginDto } from '@Dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@Systems/auth.guard';
import { ValidationPipe } from '@Systems/validation.pipe';
import { UserCustomDecorator } from './user.decorator';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  getAllUser(@UserCustomDecorator() user: UserRegisterDto) {
    return this.userService.getAllUser(user);
  }

  @Post('reset-password')
  async resetPassword(@Query('username') username: string) {
    return this.userService.resetPassword(username);
  }
  @Post('register')
  @UsePipes(new ValidationPipe())
  async registorUser(@Body() userData: UserRegisterDto) {
    return this.userService.register(userData);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() userData: UserLoginDto) {
    return this.userService.login(userData);
  }

  // @Put('update')
  // @UseGuards(new AuthGuard()) // check token
  // async updateUser(
  //   @Body() data: UserDto,
  //   @UserCustomDecorator() user: UserDto,
  // ) {
  //   // return this.userService.updateUser(data, user);
  // }
}
