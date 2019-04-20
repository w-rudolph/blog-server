import { Controller, Get } from '@nestjs/common';

@Controller('/admin/comment')
export class CommentController {
  @Get('list')
  actionGetList() {}
}
