import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects.entity';
import { Repository } from 'typeorm';
import { CreateProjectDTO } from '../dto/project-create.dto';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';
import { UpdateProjectDTO } from '../dto/update-project.dto';

@Injectable()
export class ProjectProvider {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly paginationService: PaginationService,
  ) {}

  public async getAllProjects(page: number, limit: number) {
    const qb = this.projectRepository
      .createQueryBuilder('project')
      .select([
        'project.id',
        'project.name',
        'project.slug',
        'project.description',
        'project.isActive',
        'project.createdAt',
      ])
      .where('project.isDelete = :isDelete', { isDelete: false })
      .andWhere('project.isActive = :isActive', { isActive: true });

    return await this.paginationService.paginateQuery(
      { page: page, limit: limit },
      qb,
    );
  }

  public async createProject(createProjectDTO: CreateProjectDTO) {
    try {
      const { slug } = createProjectDTO;

      const isDuplicated = await this.projectRepository.exists({
        where: { slug },
      });

      if (isDuplicated) {
        throw new BadRequestException(
          `Duplicate entry found with this Slug: "${slug}"`,
        );
      }

      const newProject = this.projectRepository.create(createProjectDTO);
      return await this.projectRepository.save(newProject);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  public async findOneProjectById(id: number) {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });

      if (!project) {
        throw new NotFoundException(`Project with this id: #${id} not found.`);
      }

      return project;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new InternalServerErrorException('Failed to fetch project');
    }
  }

  public async updateProject(id: number, updateProjectDTO: UpdateProjectDTO) {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });

      if (!project) {
        throw new NotFoundException(`Project #${id} not found!`);
      }

      Object.assign(project, updateProjectDTO);

      return await this.projectRepository.save(project);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update project');
    }
  }

  public async activeStatusChangeById(id: number) {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
      });

      if (!project) {
        throw new NotFoundException(`Project with id#${id} not found!`);
      }

      project.isActive = !project.isActive; 
      await this.projectRepository.save(project);

      return {
        message: `Project #${id} is now ${project.isActive ? 'Active' : 'Inactive'}`,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to update project status');
    }
  }
  public async softDeleteById(id: number) {
    try {
      const project = await this.projectRepository.findOne({
        where: { id, isDelete: false },
      });

      if (!project) {
        throw new NotFoundException(
          `Project with this id#${id} already deleted!`,
        );
      }

      project.isDelete = true;
      await this.projectRepository.save(project);

      return { message: `Project #${id} deleted successfully` };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to delete project');
    }
  }
}
