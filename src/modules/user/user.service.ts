import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userR: Repository<User>,
  ) {}

  async getUserByField(
    field: FindConditions<User>,
    select?: (keyof User)[],
  ): Promise<User> {
    return await this.userR.findOne(field, {
      select: select || ['id', 'name', 'email', 'sex', 'status'],
    });
  }
  async getUser(field: Partial<User>): Promise<User> {
    return await this.getUserByField(field);
  }

  async insertUser(user: User) {
    return await this.userR.insert(user);
  }

  async getUsers(param: any = {}): Promise<[User[], number]> {
    const { limit, offset } = param;
    return await this.userR.findAndCount({
      select: ['id', 'name', 'email', 'sex', 'status'],
      take: limit,
      skip: offset,
    });
  }
}
