import { HttpException, HttpStatus } from '@nestjs/common';
//TODO : kiểm tra xem người dùng đã đăng nhập chưa để cho phép requests hay không
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jsonWebToken from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // check xem trong header request có authorization chưa
    if (!request.headers.authorization) {
      throw new HttpException('no token', HttpStatus.BAD_REQUEST);
      return false;
    }
    // check token
    // gắn user vào cho requests
    request.user = await this.validateToken(request.headers.authorization);

    return true;
  }
  async validateToken(auth: string) {
    // check token hợp lệ chưa
    if (auth.split(' ')[0] !== 'Bearer') {
      // format Token : Bearer ...token
      // báo token không hợp lệ
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = auth.split(' ')[1];
    // giải mã token
    // process.env.SECRET : mật mã để giải mã hoặc tạo token
    try {
      const decoded = await jsonWebToken.verify(token, process.env.SECRET);
      return decoded;
    } catch (error) {
      const message = 'Token hết hạn: ' + (error.message || error.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
