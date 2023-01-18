import { RoleConstants } from '@Constants/role.constants';
import { UserDto } from '@Dto/user.dto';
import { UserEntity } from '@Entitys/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkRole } from '@Utils/check_role';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getAllUser(user: UserDto) {
    const { username } = user;
    const userProfile = await this.userRepository.findOne({
      where: { username },
    });
    if (!userProfile) {
      throw new HttpException(
        'User không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleAdmin = await checkRole(userProfile, RoleConstants.ADMIN);
    if (!roleAdmin) {
      throw new HttpException(
        'Bạn không có quyền admin',
        HttpStatus.BAD_REQUEST,
      );
    }
    const listUser = await this.userRepository.find();
    return listUser;
  }
  async resetPassword() {
    // // Thiết lập thông tin email
    // const mailOptions = {
    //   from: '"Your Name" fmsn0097@gmail.com',
    //   to: 'doanthanhluc91bvh@gmail.com',
    //   subject: 'Test Email',
    //   text: 'Hello World!',
    //   html: '<b>Hello World!</b>',
    // };

    // await transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return console.log(error);
    //   }
    //   console.log('Message sent: %s', info.messageId);
    // });

    return 'success';
  }

  async login(userData: UserDto) {
    const { username, password } = userData;

    const userProfile = await this.userRepository.findOne({
      where: { username },
    });

    if (!userProfile) {
      throw new HttpException(
        'User không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!(await userProfile.comparePassword(password))) {
      throw new HttpException(
        'Sai mật khẩu vui lòng thử lại',
        HttpStatus.BAD_REQUEST,
      );
    }

    return userProfile.responseData({ showToken: true });
  }

  async register(userData: UserDto) {
    const { username, password } = userData;

    const userProfile = await this.userRepository.findOne({
      where: { username },
    });

    if (userProfile) {
      throw new HttpException(
        'User đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.userRepository.create({ username, password });
    await this.userRepository.save(newUser);

    return newUser.responseData({ showToken: true });
  }
}
