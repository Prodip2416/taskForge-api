import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './providers/user.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { HashingModule } from '../auth/hashing/hashing.module';
import {  GetOneUserProvider } from './providers/get-user.provider';

@Module({
  imports: [HashingModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserProvider,
    GetOneUserProvider
  ],
  exports: [UserService],
})
export class UserModule {}
