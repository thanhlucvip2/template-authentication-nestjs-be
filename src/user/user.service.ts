import { RoleConstants } from '@Constants/role.constants';
import { UserLoginDto, UserRegisterDto } from '@Dto/user.dto';
import { UserEntity } from '@Entitys/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkRole } from '@Utils/check_role';
import { randomKey } from '@Utils/ramdom-key';
import { Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailservice: MailerService,
  ) {}
  async getAllUser(user: UserRegisterDto) {
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
  async resetPassword(username: string) {
    if (!username) {
      throw new HttpException('Vui lòng điền username', HttpStatus.BAD_REQUEST);
    }
    const newPassword = randomKey(10);

    const userProfile = await this.userRepository.findOne({
      where: { username },
    });
    if (!userProfile) {
      throw new HttpException(
        `${username} không tồn tại trong hệ thống`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.update(
      { username },
      { ...userProfile, password: await userProfile.hashPassword(newPassword) },
    );

    await this.mailservice.sendMail({
      to: userProfile.email,
      from: 'Hacheehouse Shop',
      subject: 'RESET PASSWORD', // Subject line
      text: 'Hacheehouse Shop', // plaintext body
      html: `<h1>${newPassword}</h1>`,
    });

    return 'Vui lòng kiểm tra email';
  }

  async login(userData: UserLoginDto) {
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

  async register(userData: UserRegisterDto) {
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
