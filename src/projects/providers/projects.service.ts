import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from '../projects.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProjectDTO } from '../dto/project-create.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  public async create(createProjectDTO: CreateProjectDTO) {
    const { slug } = createProjectDTO;
    const isDuplicated = await this.projectRepository.find({
      where: {
        slug,
      },
    });
    if(isDuplicated){
        throw new BadRequestException('Dublicated slug name found!');
    }
    let newProject = this.projectRepository.create(createProjectDTO);
    newProject = await this.projectRepository.save(newProject);
    return newProject;
  }
}
