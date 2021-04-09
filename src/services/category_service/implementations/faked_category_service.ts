import { CategoryService, CategoryWithCount } from '../category_service';

export class FakedCategoryService extends CategoryService {
  async fetchCategories(): Promise<CategoryWithCount[]> {
    return [
      {
        name: 'category1',
        count: 5,
      },
    ];
  }
}
