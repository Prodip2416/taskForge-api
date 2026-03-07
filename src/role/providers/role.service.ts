import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDTO } from '../dtos/craete-role.dto';
import { Repository } from 'typeorm';
import { Role } from '../role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/user/enum/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async create(createRoleDTO: CreateRoleDTO) {
    try {
      if (!createRoleDTO.name?.trim()) {
        throw new BadRequestException('Role name cannot be empty');
      }

      // Check duplicate
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDTO.name },
      });

      if (existingRole) {
        throw new ConflictException(
          `Role "${createRoleDTO.name}" already exists`,
        );
      }

      // Create & save
      const newRole = this.roleRepository.create(createRoleDTO);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new ConflictException('Role already exists');
      }

      // Fallback
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  public async findByEnums(roleEnums: RoleEnum[]) {
    try {
      const roles = await this.roleRepository.find({
        where: roleEnums.map((name) => ({ name })),
      });

      // Check if all requested roles exist
      if (roles.length !== roleEnums.length) {
        const foundNames = roles.map((r) => r.name);
        const missing = roleEnums.filter((r) => !foundNames.includes(r));
        throw new NotFoundException(`Roles not found: ${missing.join(', ')}`);
      }

      return roles;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }
}
