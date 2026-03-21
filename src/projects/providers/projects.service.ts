import { Injectable } from '@nestjs/common';
import { CreateProjectDTO } from '../dto/project-create.dto';
import { ProjectProvider } from './project.provider';
import { UpdateProjectDTO } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectProvider: ProjectProvider) {}

  public async getAll(page: number, limit: number) {
    return await this.projectProvider.getAllProjects(page, limit);
  }

  public async create(createProjectDTO: CreateProjectDTO) {
    return await this.projectProvider.createProject(createProjectDTO);
  }

  public async findOne(projectId: number) {
    return await this.projectProvider.findOneProjectById(projectId);
  }

  public async update(projectId: number, updateProjectDTO: UpdateProjectDTO) {
    return await this.projectProvider.updateProject(
      projectId,
      updateProjectDTO,
    );
  }
}
