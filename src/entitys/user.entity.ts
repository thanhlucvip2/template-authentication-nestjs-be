import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';
import { RoleConstants } from '@Constants/role.constants';
import { StatusUserConstants } from '@Constants/status-user.constants';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  username: string;

  // trạng thái user đã active chưa
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    default: StatusUserConstants.NO_ACTIVE,
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  // mặc định quyền user khi tạo
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    default: RoleConstants.USER,
  })
  role: string;

  // code để xác minh
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  veryCode: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  // trước khi insert mã hóa passwrd
  @BeforeInsert()

  // hàm mã hóa pass khi tạo user hoặc dùng để mã hóa khi update user
  async hashPassword(passWord: string) {
    if (passWord) {
      return await bcrypt.hash(passWord, 10);
    }
    return (this.password = await bcrypt.hash(this.password, 10));
  }

  // tạo user mẫu khi đăng nhập
  userProfile(showToken = false) {
    const { email, username, role, status, createAt, token } = this;
    const data = { email, username, role, status, createAt, token };
    if (!showToken) {
      delete data.token;
    }
    return data;
  }

  async comparePassword(passwordHash: string): Promise<boolean> {
    // check password trùng khớp không
    return await bcrypt.compare(passwordHash, this.password);
  }

  // tạo token
  private get token() {
    const { id, username, createAt, updateAt, role } = this;
    return jsonwebtoken.sign(
      {
        id,
        username,
        createAt,
        updateAt,
        role,
      },
      process.env.SECRET,
      {
        expiresIn: '1h',
      },
    );
  }
}
