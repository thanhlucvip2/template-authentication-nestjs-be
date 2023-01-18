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
    default: RoleConstants.USER,
  })
  role: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @BeforeInsert()
  // trước khi insert mã hóa pass
  async hashPassword() {
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
  async comparePassword(passwordHash: string): Promise<boolean> {
    // check password trùng khớp không
    return await bcrypt.compare(passwordHash, this.password);
  }
  private get token() {
    const { id, username, createAt, updateAt } = this;
    return jsonwebtoken.sign(
      {
        id,
        username,
        createAt,
        updateAt,
      },
      process.env.SECRET,
      {
        expiresIn: '1h',
      },
    );
  }
}
