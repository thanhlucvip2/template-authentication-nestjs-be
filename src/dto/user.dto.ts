import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  role?: string;
}
export class UserProfileModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  username: string;
  role: string;
  password: string;
}
