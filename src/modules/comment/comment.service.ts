import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindConditions } from 'typeorm';
import { Comment } from './comment.entity';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRef: Repository<Comment>,
  ) {}

  async getCommentList(postId: number) {
    const req = await this.commentRef
      .createQueryBuilder('comment')
      .where({ postId })
      .leftJoin('user', 'u1', 'u1.id = comment.userId')
      .leftJoin('user', 'u2', 'u2.id = comment.toUser')
      .select(['comment.*', 'u1.name as userName', 'u2.name as toUserName']);

    return req.getRawMany();
  }

  addComment(comment: Comment) {
    return this.commentRef.save(comment);
  }
}
