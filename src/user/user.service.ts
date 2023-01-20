import { RoleConstants } from '@Constants/role.constants';
import { StatusUserConstants } from '@Constants/status-user.constants';
import { ResponseData } from '@Dto/response-data';
import {
  UserLoginDto,
  UserRegisterDto,
  UserUpdatePasswordDto,
} from '@Dto/user.dto';
import { UserEntity } from '@Entitys/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkRole } from '@Utils/check_role';
import { randomKey } from '@Utils/ramdom-key';
import { EntityManager, Repository } from 'typeorm';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailservice: MailerService,
    private manageEntity: EntityManager,
  ) {}

  async getAllUser(userAuth: { username: string }) {
    const { username } = userAuth;
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
  async getUserProfile(userAuth: { username: string }) {
    const { username } = userAuth;

    const userProfile = await this.userRepository.findOne({
      where: { username },
    });
    if (!userProfile) {
      throw new HttpException(
        'User không tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }

    return userProfile.userProfile();
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

    try {
      await this.mailservice.sendMail({
        to: userProfile.email,
        from: 'Hacheehouse Shop',
        subject: 'Reset Password', // Subject line
        text: 'Hacheehouse Shop', // plaintext body
        html: `<h1> New password : ${newPassword}</h1>`,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    const newResponse = new ResponseData<null>({
      code: HttpStatus.OK,
      status: 'SUCCESS',
      message: 'Thành công. Vui lòng kiểm tra email!',
      method: 'POST',
      data: null,
      timeRes: new Date(),
    });

    return newResponse;
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

    if (userProfile.status === StatusUserConstants.NO_ACTIVE) {
      throw new HttpException(
        'User chưa được xác minh, vui lòng kiểm tra email để xác nhận',
        HttpStatus.BAD_REQUEST,
      );
    }

    return userProfile.responseData({ showToken: true });
  }

  async updatePassword(
    userData: UserUpdatePasswordDto,
    userAuth: { username: string },
  ) {
    const { password, newPassword } = userData;
    const { username } = userAuth;
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

    if (userProfile.status === StatusUserConstants.NO_ACTIVE) {
      throw new HttpException(
        'User chưa được xác minh, vui lòng kiểm tra email để xác nhận',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userRepository.update(
      { username },
      { ...userProfile, password: await userProfile.hashPassword(newPassword) },
    );

    const newResponse = new ResponseData<null>({
      message: 'Cập nhật mật khẩu thành công!',
      status: 'SUCCESS',
      timeRes: new Date(),
      code: HttpStatus.OK,
      method: 'PUT',
      data: null,
    });
    return newResponse;
  }

  async register(userData: UserRegisterDto) {
    const { username, password, email } = userData;
    const userProfile = await this.manageEntity
      .createQueryBuilder(UserEntity, 'userTable')
      .where('username = :username OR email = :email', {
        username,
        email,
      })
      .getOne();
    if (userProfile) {
      throw new HttpException(
        'User hoặc email đã tồn tại trong hệ thống',
        HttpStatus.BAD_REQUEST,
      );
    }
    const veryCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    const newUser = await this.userRepository.create({
      username,
      password,
      email,
      veryCode: veryCode,
    });

    await this.userRepository.save(newUser);

    try {
      await this.mailservice.sendMail({
        to: email,
        from: 'Hacheehouse Shop',
        subject: 'Very Code', // Subject line
        text: 'Hacheehouse Shop', // plaintext body
        html: `<h1> VeryCode : ${veryCode}</h1>`,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    const newResponse = new ResponseData<null>({
      code: HttpStatus.OK,
      status: 'SUCCESS',
      timeRes: new Date(),
      message: 'Đăng ký thành công, vui lòng kiểm tra email để xác minh!',
      method: 'POST',
      data: null,
    });
    return newResponse;
  }

  async veryCode(data: { username: string; code: string }) {
    const { username, code } = data;
    if (!username || !code) {
      throw new HttpException(
        'Vui lòng điền đủ username và code xác nhận!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userProfile = await this.userRepository.findOne({
      where: { username },
    });
    if (!userProfile) {
      throw new HttpException(
        'User không tồn tại trong hệ thống!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userProfile.veryCode !== code) {
      throw new HttpException(
        'Mã xác nhận không chính xác, vui lòng thử lại!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userProfile.status === StatusUserConstants.ACTIVE) {
      throw new HttpException(
        'User đã xác minh, vui lòng đăng nhập!',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const newData = { ...userProfile, status: StatusUserConstants.ACTIVE };
      await this.userRepository.update({ username }, newData);
      const response = new ResponseData({
        code: HttpStatus.OK,
        data: null,
        message: 'Xác minh thành công, vui lòng đăng nhập!',
        method: 'GET',
        status: 'SUCCESS',
        timeRes: new Date(),
      });
      return response;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async resendCode(username: string) {
    if (!username) {
      throw new HttpException(
        'Vui lòng điền username!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userProfile = await this.userRepository.findOne({
      where: { username },
    });
    if (!userProfile) {
      throw new HttpException(
        `${username} không tồn tại trong hệ thống`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (userProfile.status === StatusUserConstants.ACTIVE) {
      throw new HttpException(
        'User đã xác minh, vui lòng đăng nhập!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const veryCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    await this.userRepository.update(
      { username },
      { ...userProfile, veryCode },
    );

    try {
      await this.mailservice.sendMail({
        to: userProfile.email,
        from: 'Hacheehouse Shop',
        subject: 'NEW VERYCODE', // Subject line
        text: 'Hacheehouse Shop', // plaintext body
        html: `<h1> New Verycode : ${veryCode}</h1>`,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    const newResponse = new ResponseData<null>({
      code: HttpStatus.OK,
      status: 'SUCCESS',
      message: 'Thành công. Vui lòng kiểm tra email!',
      method: 'POST',
      data: null,
      timeRes: new Date(),
    });

    return newResponse;
  }
}
