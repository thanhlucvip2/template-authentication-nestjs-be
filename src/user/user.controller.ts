import {
  UserRegisterDto,
  UserLoginDto,
  UserUpdatePasswordDto,
} from '@Dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Query,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@Systems/auth.guard';
import { ValidationPipe } from '@Systems/validation.pipe';
import { UserCustomDecorator } from './user.decorator';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all-user')
  @UseGuards(new AuthGuard()) // check token
  getAllUser(@UserCustomDecorator() userAuth: { username: string }) {
    return this.userService.getAllUser(userAuth);
  }

  @Get('resend-code')
  resendCode(@Query() data: { username: string }) {
    return this.userService.resendCode(data.username);
  }
  @Get('user-profile')
  @UseGuards(new AuthGuard()) // check token
  getUserProfile(@UserCustomDecorator() userAuth: { username: string }) {
    return this.userService.getUserProfile(userAuth);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: { username: string }) {
    return this.userService.resetPassword(data.username);
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

  @Get('very-code')
  veryCode(@Query() data: { username: string; code: string }) {
    return this.userService.veryCode(data);
  }

  @Put('update-password')
  @UsePipes(new ValidationPipe())
  @UseGuards(new AuthGuard()) // check token
  async updateUser(
    @UserCustomDecorator() userAuth: { username: string },
    @Body() dataPassword: UserUpdatePasswordDto,
  ) {
    return this.userService.updatePassword(dataPassword, userAuth);
  }
}
