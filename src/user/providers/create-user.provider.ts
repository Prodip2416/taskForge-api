import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/hashing/provider/hashing.provider';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/providers/role.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private hashingProvider: HashingProvider,
    private roleService: RoleService,
  ) {}

  public async createUser(createUserDto: CreateUserDTO) {
    let existingUser;
    const { roles: roleEnums = [], password, ...rest } = createUserDto;
    try {
      // Check is user exists with same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // Handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }
    // Fetch roles by enum name
    let roles: Role[] = [];
    if (roleEnums.length > 0) {
      try {
        roles = await this.roleService.findByEnums(roleEnums);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new RequestTimeoutException(
          'Unable to process your request at the moment please try later',
          { description: 'Error fetching roles from the database' },
        );
      }
    }

    // Create a new user
    let newUser = this.usersRepository.create({
      ...rest,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
      roles,
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the the datbase',
        },
      );
    }

    return newUser;
  }
}
