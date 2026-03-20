import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './providers/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './projects.entity';
import { ProjectProvider } from './providers/project.provider';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectProvider],
  imports: [TypeOrmModule.forFeature([Project]), PaginationModule],
  exports:[ProjectsService]
})
export class ProjectsModule {}
