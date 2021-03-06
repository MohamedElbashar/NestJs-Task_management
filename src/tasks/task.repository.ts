import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status=:status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title Like :search OR task.description Like :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Faild to get task fro user "${
          user.username
        }", Filters:${JSON.stringify(filterDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;

    try {
      await task.save();
    } catch (err) {
      this.logger.error(
        `Faild to create task for user "${
          user.username
        }", Filters:${JSON.stringify(createTaskDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }
}
