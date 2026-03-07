import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './providers/user.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { HashingModule } from '../auth/hashing/hashing.module';
import { GetOneUserProvider } from './providers/get-user.provider';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [HashingModule, TypeOrmModule.forFeature([User]), RoleModule],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserProvider,
    GetOneUserProvider,
    PaginationService,
  ],
  exports: [UserService],
})
export class UserModule {}
