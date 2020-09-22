import { CategoriesService } from '../categories_service';
import { EngagementCategory } from '../../../schemas/engagement_category';

export class FakedCategoriesService extends CategoriesService {
  async fetchCategories(): Promise<EngagementCategory[]> {
    return [{
      name: 'category1',
      count: 5
    }]
  }
}
