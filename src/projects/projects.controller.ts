import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './providers/projects.service';
import { CreateProjectDTO } from './dto/project-create.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';

@Controller('project')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Get('/get-all')
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.projectService.getAll(page, limit);
  }

  @Get('/:projectId')
  @HttpCode(HttpStatus.OK)
  public async findOne(@Param('projectId', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createProjectDTO: CreateProjectDTO) {
    return this.projectService.create(createProjectDTO);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDTO: UpdateProjectDTO,
  ) {
    return this.projectService.update(id, updateProjectDTO);
  }

  @Delete('change-active-status/:id')
  @HttpCode(HttpStatus.OK)
  public async changeActiveStatus(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.activeStatusChnage(id);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.delete(id);
  }
}
