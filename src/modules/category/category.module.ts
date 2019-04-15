import { UserService } from './../user/user.service';
import { CategoryController } from './category.controller';
import { AuthService } from './../auth/auth.service';
import { AuthModule } from './../auth/auth.module';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  providers: [UserService, AuthService, CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
