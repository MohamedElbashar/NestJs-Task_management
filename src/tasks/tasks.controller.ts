import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksServise.createTask(createTaskDto);
  }
}
