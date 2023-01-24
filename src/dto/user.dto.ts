import { IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  fullName: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
export class UserUpdatePasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  newPassword: string;
}
export class UserProfileModel {
  email: string;
  username: string;
  role: string;
  status: string;
  createAt: Date;
  token?: string;
}
export class UserByToken {
  id: string;
  username: string;
  createAt: string;
  updateAt: string;
  role: string;
  iat: number;
  exp: number;
}
