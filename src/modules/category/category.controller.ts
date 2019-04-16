import { StatusCode } from '../../common/error-status';
import { Category, CategoryStatus } from './category.entity';
import { CategoryService } from './category.service';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from './../auth/jwt-auth.guard';

@Controller('admin/category')
export class CategoryController {
  constructor(private catService: CategoryService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async actionList() {
    return await this.catService.getCategories({
      order: { id: 'DESC' },
    });
  }

  @Get('simple-list')
  async actionListSimple() {
    return await this.catService.getCategories({
      where: { status: CategoryStatus.PUBLISHED },
      select: ['id', 'name', 'alias', 'sort'],
      order: { id: 'DESC' },
    });
  }

  @Post('save')
  @UseGuards(JwtAuthGuard)
  async actionSave(
    @Body('catId') id: number,
    @Body('name') name: string,
    @Body('alias') alias: string,
    @Body('sort') sort: number,
  ) {
    const catId = Number(id);
    const sortId = Number(sort) || 100;
    let cat: Category;
    if (catId) {
      cat = await this.catService.getCategory({ id: catId });
    }
    if (!cat || !catId) {
      cat = new Category();
    }
    const fdCat = await this.catService.checkCategoryNameOrAliasValid(
      catId,
      name,
      alias,
    );
    if (fdCat) {
      throw new HttpException(`分类名字或别名不能重复！`, StatusCode.FAIL);
    }
    if (cat.status === CategoryStatus.DELETED) {
      cat.status = CategoryStatus.DRAFT;
    }
    cat.name = name;
    cat.alias = alias;
    cat.sort = sortId;
    return await this.catService.saveCategory(cat);
  }

  @Post('update-status')
  @UseGuards(JwtAuthGuard)
  async actionDel(
    @Body('catId') id: number,
    @Body('status') status: CategoryStatus,
  ) {
    const catId = Number(id);
    status = Number(status);
    let cat = null;
    if (catId) {
      cat = await this.catService.getCategory({ id: catId });
    }
    if (!catId || !cat) {
      throw new HttpException(`分类不存在！`, StatusCode.FAIL);
    }
    if (
      (cat.status !== CategoryStatus.DRAFT &&
        status === CategoryStatus.PUBLISHED) ||
      (cat.status === CategoryStatus.DELETED &&
        status === CategoryStatus.DELETED)
    ) {
      throw new HttpException(`状态不正确！`, StatusCode.FAIL);
    }
    cat.status = status;
    return await this.catService.saveCategory(cat);
  }
}
