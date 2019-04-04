import { AuthService } from './../auth/auth.service';
import { UserService } from './../user/user.service';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  providers: [PostService, AuthService, UserService],
  controllers: [PostController],
})
export class PostModule {}
