import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Injectable } from '@nestjs/common';
import { Repository, FindConditions, FindManyOptions } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly catRep: Repository<Category>,
  ) {}

  async getCategories(options?: FindManyOptions<Category>) {
    return await this.catRep.find(options);
  }

  async saveCategory(cat: Category) {
    return await this.catRep.save(cat);
  }

  async checkCategoryNameOrAliasValid(id: number, name: string, alias: string) {
    const query = id
      ? 'category.id <> :id and category.name = :name or category.id <> :id and category.alias = :alias'
      : 'category.name = :name or category.alias = :alias';
    return this.catRep
      .createQueryBuilder('category')
      .where(query, { id, name, alias })
      .getOne();
  }

  async getCategory(
    field: FindConditions<Category>,
    select?: (keyof Category)[],
  ) {
    return await this.catRep.findOne(field, { select });
  }
}
