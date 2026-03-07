import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserService } from './providers/user.service';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { AuthDecorator } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    console.log(activeUser);
    return await this.userService.findAll(limit, page);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @AuthDecorator(AuthType.None)
  public async createUser(@Body() createUserDTO: CreateUserDTO) {
    return await this.userService.createUser(createUserDTO);
  }
}
