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

  async getUserSimpleInfo(where: FindConditions<User>): Promise<User> {
    return await this.userR.findOne(where, {
      select: ['id', 'name', 'email', 'sex', 'status'],
    });
  }

  async getUserDetail(where: FindConditions<User>) {
    const user = await this.userR.findOne(where);
    delete user.password;
    return user;
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

  async getUser(where: FindConditions<User>) {
    return await this.userR.findOne(where);
  }

  async saveUser(user: User) {
    return await this.userR.save(user);
  }

  async checkUserEmailValid(email: string, userId: number) {
    return await this.userR
      .createQueryBuilder('user')
      .where(`user.email = :email and user.id <> :id`, { email, id: userId })
      .getOne();
  }
}
