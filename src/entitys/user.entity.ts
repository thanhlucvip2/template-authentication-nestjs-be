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

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    default: RoleConstants.USER,
  })
  role: string;
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    // default: Math.floor(100000 + Math.random() * 900000),
  })
  veryCode: string;

  @Column({ type: 'text', nullable: false })
  password: string;
  // trước khi insert mã hóa pass
  @BeforeInsert()
  async hashPassword(passWord: string) {
    if (passWord) {
      return await bcrypt.hash(passWord, 10);
    }
    return (this.password = await bcrypt.hash(this.password, 10));
  }

  responseData({ showToken }: { showToken?: boolean }) {
    const { username, createAt, updateAt, token } = this;
    const data = { username, createAt, updateAt, token };
    if (!showToken) {
      delete data.token;
    }
    return data;
  }
  userProfile() {
    const { email, username, role, status, createAt } = this;
    return { email, username, role, status, createAt };
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
