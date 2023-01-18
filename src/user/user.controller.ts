import { UserDto } from '@Dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
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
  getAllUser(@UserCustomDecorator() user: UserDto) {
    return this.userService.getAllUser(user);
  }

  @Post('reset-password')
  // @UseGuards(new AuthGuard()) // check token
  async resetPassword(
    @UserCustomDecorator() user: UserDto,
    @Query('username') username: string,
  ) {
    return this.userService.resetPassword();
  }
  @Post('register')
  async registorUser(@Body() userData: UserDto) {
    return this.userService.register(userData);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() userData: UserDto) {
    return this.userService.login(userData);
  }

  @Put('update')
  @UseGuards(new AuthGuard()) // check token
  async updateUser(
    @Body() data: UserDto,
    @UserCustomDecorator() user: UserDto,
  ) {
    // return this.userService.updateUser(data, user);
  }
}
