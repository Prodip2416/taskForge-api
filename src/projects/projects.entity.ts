import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 500 })
  name: string;

  @Column({ nullable: false, unique: true, length: 500 })
  slug: string;

  @Column({ nullable: true, length: 1000 })
  description: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false, default: true })
  isDelete: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
