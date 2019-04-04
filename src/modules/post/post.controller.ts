import { User } from './../user/user.entity';
import { StatusCode } from './../../common/error-status';
import {
  Get,
  Post,
  Res,
  Req,
  Body,
  Query,
  Controller,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from './../auth/jwt-auth.guard';
import { isEmpty, checkLength, checkMinLength } from '../../common/util/validator';
import { Post as PostEntity, PostStatus } from './post.entity';
import { PostService } from './post.service';
import { UserService } from './../user/user.service';

@Controller('admin/post')
export class PostController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('list-simple')
  async actionListSimple(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    offset = Number(offset) || 0;
    limit = Number(limit) || 25;
    const [rows, total] = await this.postService.getPosts({
      limit,
      offset,
      select: ['id', 'title', 'abstract', 'createAt', 'updateAt', 'author'],
    });
    return { rows, total };
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async actionList(
    @Req() req: any,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    offset = Number(offset) || 0;
    limit = Number(limit) || 25;
    const [rows, total] = await this.postService.getPosts({
      limit,
      offset,
      author: req.currentUser && req.currentUser.id,
    });
    return { rows, total };
  }

  @Get('detail')
  async actionDetail(@Query('postId') id: number) {
    if (!id) return {};
    const post = await this.postService.getPost({ id });
    if (!post) {
      throw new HttpException(`Post不存在！`, StatusCode.FAIL);
    }
    const user =
      (await this.userService.getUser({ id: post.author })) || ({} as User);
    return {
      ...post,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async actionSave(
    @Req() req: any,
    @Body('postId') id: number,
    @Body('title') title: string,
    @Body('abstract') abstract: string,
    @Body('content') content: string,
    @Body('preview') preview: string,
  ) {
    const isNew = !Number(id);
    let post = new PostEntity();
    let error = '';
    if (isEmpty([title, abstract, content])) {
      error = '请输入完整的信息！';
    } else if (!checkLength(title, 5, 32)) {
      error = '标题长度应控制在5到32个字符之内';
    } else if (!checkLength(abstract, 10, 50)) {
      error = '摘要长度应控制在20到100个字符之内';
    } else if (!checkMinLength(content, 50)) {
      error = '正文长度至少50个字符';
    } else if (!isNew) {
      post = (await this.postService.getPost({ id })) as PostEntity;
      if (post && post.author !== req.currentUser.id) {
        error = '没有权限编辑他人的文章';
      }
    }
    if (error) {
      throw new HttpException(`操作失败[${error}]`, StatusCode.FAIL);
    }
    post.content = content;
    post.title = title;
    post.abstract = abstract;
    post.preview = preview;
    let ret = null;
    if (isNew) {
      post.author = req.currentUser.id;
      ret = await this.postService.insertPost(post);
    } else {
      ret = await this.postService.updatePost(post);
    }
    return this.postService.getPost({ id: post.id || ret.raw.insertId });
  }

  @Post('publish')
  @UseGuards(JwtAuthGuard)
  async actionPublish(@Req() req: any, @Body('postId') id: number) {
    let error = '';
    let post: PostEntity = null;
    if (isEmpty([id])) {
      error = 'PostId 错误！';
    } else {
      post = (await this.postService.getPost({ id })) as PostEntity;
      if (post && post.author !== req.currentUser.id) {
        error = '没有权限！';
      }
    }
    if (post.status !== PostStatus.DRAFT) {
      error = '状态错误！';
    }
    if (error) {
      throw new HttpException(`操作失败[${error}]`, StatusCode.FAIL);
    }
    const savePost = new PostEntity();
    savePost.status = PostStatus.PUBLISHED;
    return this.postService.updatePost(savePost);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async actionDelete(@Req() req: any, @Body('postId') id: number) {
    let error = '';
    let post: PostEntity = null;
    if (isEmpty([id])) {
      error = 'PostId 错误！';
    } else {
      post = (await this.postService.getPost({ id })) as PostEntity;
      if (post && post.author !== req.currentUser.id) {
        error = '没有权限！';
      }
    }
    if (post.status !== PostStatus.DRAFT) {
      error = '状态错误！';
    }
    if (error) {
      throw new HttpException(`操作失败[${error}]`, StatusCode.FAIL);
    }
    const savePost = new PostEntity();
    savePost.status = PostStatus.DELETED;
    return this.postService.updatePost(savePost);
  }
}
