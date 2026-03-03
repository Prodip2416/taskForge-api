import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './providers/user.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { HashingModule } from '../auth/hashing/hashing.module';

@Module({
  imports: [HashingModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, CreateUserProvider],
})
export class UserModule {}
