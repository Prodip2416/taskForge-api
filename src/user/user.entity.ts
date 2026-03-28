import { Exclude } from 'class-transformer';
import { Role } from '../role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../projects/projects.entity';

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

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',   
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToMany(() => Project, (project) => project.members)
  projects: Project[];
}
