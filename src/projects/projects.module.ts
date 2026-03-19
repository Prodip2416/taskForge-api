import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './providers/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './projects.entity';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [TypeOrmModule.forFeature([Project])],
  exports:[ProjectsService]
})
export class ProjectsModule {}
