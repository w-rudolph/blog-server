import { StatusCode } from '../../common/error-status';
import { Category, CategoryStatus } from './category.entity';
import { CategoryService } from './category.service';
import { Controller, Get, Post, Body, Query, UseGuards, HttpException } from '@nestjs/common';
import { AuthGuard as JwtAuthGuard } from './../auth/jwt-auth.guard';

@Controller('admin/category')
export class CategoryController {
    constructor(private catService: CategoryService) { }

    @Get('list')
    async actionList() {
        return await this.catService.getCategories();
    }

    @Get('list-simple')
    async actionListSimple() {
        return await this.catService.getCategories({
            select: ['id', 'name', 'alias'],
        });
    }

    @Post('save')
    @UseGuards(JwtAuthGuard)
    async actionSave(
        @Body('catId') id: number,
        @Body('name') name: string,
        @Body('alias') alias: string,
    ) {
        const catId = Number(id) || undefined;
        let cat = null;
        if (catId) {
            cat = await this.catService.getCategory({ id: catId });
        }
        if (!catId || !cat) {
            if (this.catService.findCategoryByNameOrAlias(name, alias)) {
                throw new HttpException(`分类名字或别名不能重复！`, StatusCode.FAIL);
            }
            cat = new Category();
        }
        cat.name = name;
        cat.alias = alias;
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
        if (status !== CategoryStatus.DEFAULT && status !== CategoryStatus.DELETED) {
            throw new HttpException(`状态不正确！`, StatusCode.FAIL);
        }
        cat.status = status;
        return await this.catService.saveCategory(cat);
    }
}
