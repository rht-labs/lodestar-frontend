import { CategoryService } from '../category_service';
import { EngagementCategory } from '../../../schemas/engagement_category';

export class FakedCategoryService extends CategoryService {
  async fetchCategories(): Promise<EngagementCategory[]> {
    return [
      {
        name: 'category1',
        count: 5,
      },
    ];
  }
}
