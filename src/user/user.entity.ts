import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 200 })
  firstName: string;

  @Column({ nullable: true, length: 200 })
  lastName: string;

  @Column({ unique: true, nullable: false, length: 200 })
  email: string;

  @Column({ nullable: false, length: 500 })
  @Exclude()
  password: string;

  @Column({ default: true, nullable: false })
  isActive: boolean;

  @Column({ default: false, nullable: false })
  isDelete: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
