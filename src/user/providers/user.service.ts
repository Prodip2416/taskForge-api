import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { GetOneUserProvider } from './get-user.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserProvider: CreateUserProvider,
    private readonly getOneUserProvider: GetOneUserProvider,
  ) {}

  public async findAll(limit: number, page: number) {
    return await this.getOneUserProvider.findAll(limit, page);
  }

  public async createUser(createUserDTO: CreateUserDTO) {
    return await this.createUserProvider.createUser(createUserDTO);
  }

  public async findOneByEmail(email: string) {
    return await this.getOneUserProvider.findOneByEmail(email);
  }

  public async findOneById(id: number) {
    return await this.getOneUserProvider.findOneById(id);
  }
}
