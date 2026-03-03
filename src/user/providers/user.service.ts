import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { CreateUserDTO } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
   constructor( private readonly createUserProvider: CreateUserProvider){}

   public async createUser(createUserDTO:CreateUserDTO){
    return await this.createUserProvider.createUser(createUserDTO);
   }
}
