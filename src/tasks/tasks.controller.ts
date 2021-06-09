import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksServise: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksServise.getAllTasks();
  }
  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksServise.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksServise.createTask(createTaskDto);
  }
}
