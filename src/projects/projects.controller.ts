import { Body, Controller, Post } from '@nestjs/common';
import { ProjectsService } from './providers/projects.service';
import { CreateProjectDTO } from './dto/project-create.dto';

@Controller('project')
export class ProjectsController {
    constructor(
        private readonly projectService:ProjectsService
    ){}

    @Post('create')
    public async create(@Body() createProjectDTO:CreateProjectDTO){
        return this.projectService.create(createProjectDTO);
    }
}
