import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { StatusCode } from '../../common/error-status';
import { Comment } from './comment.entity';
import { AuthGuard as JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/admin/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('list')
  async actionGetList(@Query('postId') postId) {
    postId = Number(postId);
    if (!postId) {
      throw new HttpException('无效postId', StatusCode.FAIL);
    }
    return await this.commentService.getCommentList(postId);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async actionAdd(
    @Req() req,
    @Body('postId') postId: number,
    @Body('toUser') toUser: number,
    @Body('content') content: string,
  ) {
    postId = Number(postId);
    const userId = req.currentUser && req.currentUser.id;
    toUser = Number(toUser) || 0;
    if (!postId) {
      throw new HttpException('无效postId', StatusCode.FAIL);
    }
    if (!content) {
      throw new HttpException('无效评论', StatusCode.FAIL);
    }
    const comment = new Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.toUser = toUser;
    comment.content = content;
    return await this.commentService.addComment(comment);
  }
}
