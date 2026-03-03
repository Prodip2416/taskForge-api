import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';

@Injectable()
export class GetOneUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private paginationService: PaginationService,
  ) {}

  public async findAll(limit: number, page: number) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.email']);

    return await this.paginationService.paginateQuery(
      { page: page, limit: limit },
      qb,
    );
  }

  public async findOneById(id: number) {
    let user;

    try {
      user = await this.userRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the the datbase',
        },
      );
    }
    if (!user) {
      throw new BadRequestException('The user id does not exist');
    }

    return user;
  }

  public async findOneByEmail(email: string) {
    let user;

    try {
      user = await this.userRepository.findOneBy({
        email: email,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    return user;
  }
}
