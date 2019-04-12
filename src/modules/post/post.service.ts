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

  async getPosts(params: any = {}): Promise<any> {
    const { limit, offset, ...rest } = params;
    const req = await this.postR.createQueryBuilder('post')
      .limit(limit)
      .skip(offset)
      .where(rest)
      .leftJoin('user', 'u', 'u.id = post.author')
      .leftJoin('category', 'c', 'c.id = post.category')
      .select(
        [
          'post.*',
          'u.name as authorName',
          'u.email as authorEmail',
          'c.name as categoryName',
          'c.alias as categoryAlias',
        ],
      );
    return [await req.getRawMany(), await req.getCount()];
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
