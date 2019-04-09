import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postR: Repository<Post>,
  ) { }

  async getPostByField(
    field: FindConditions<Post>,
    select?: (keyof Post)[],
  ): Promise<Post> {
    return await this.postR.findOne(field, { select });
  }
  async getPost(field: Partial<Post>, select?: (keyof Post)[]): Promise<Post> {
    return await this.getPostByField(field, select);
  }

  async insertPost(post: Post) {
    return await this.postR.insert(post);
  }

  async updatePost(post: Post) {
    return await this.postR.save(post);
  }

  async getPosts(param: any = {}): Promise<[Post[], number]> {
    const { limit, offset, ...rest } = param;
    // return await this.postR.findAndCount({
    //   ...rest,
    //   take: limit,
    //   skip: offset,
    // });
    const req = await this.postR.createQueryBuilder('post')
      .where(rest)
      .take(limit)
      .offset(offset)
      // .leftJoin('user', 'user', 'user.id = post.author')
      // .leftJoin('category', 'cat', 'cat.id = post.category')
    req.printSql();
    return await req.getManyAndCount();
  }

  async getPostDetail(field: Partial<Post>) {
    return await this.postR.createQueryBuilder('post')
      .where(field)
      .leftJoin('user', 'user', 'user.id = post.author')
      .leftJoin('category', 'cat', 'cat.id = post.category')
      .select([
        'post.*',
        'user.name as authorName',
        'cat.name as categoryName',
      ])
      .getRawOne();
  }
}
