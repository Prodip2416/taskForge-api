import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './providers/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [RoleService],
})
export class RoleModule {}
