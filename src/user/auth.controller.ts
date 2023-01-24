import { UserLoginDto } from '@Dto/user.dto';
import { ValidationPipe } from '@Pipe/validation.pipe';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() userData: UserLoginDto) {
    return this.userService.login(userData);
  }
}
