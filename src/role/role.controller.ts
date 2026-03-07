import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RoleService } from './providers/role.service';
import { CreateRoleDTO } from './dtos/craete-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createRoleDTO: CreateRoleDTO) {
    return this.roleService.create(createRoleDTO);
  }
}
