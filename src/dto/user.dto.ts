import { IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  // role?: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
export class UserProfileModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  username: string;
  role: string;
  email: string;
  password: string;
}
