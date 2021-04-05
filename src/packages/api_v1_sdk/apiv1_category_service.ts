import { CategoryService } from '../../services/category_service/category_service';
import { EngagementCategory } from '../../schemas/engagement_category';
import { handleAxiosResponseErrors } from './http_error_handlers';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { getApiV1HttpClient } from './client';

export class Apiv1CategoryService implements CategoryService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private static engagementSerializer = new EngagementJsonSerializer();

  async fetchCategories(): Promise<EngagementCategory[]> {
    try {
      const { data: categoriesData } = await this.axios.get(
        `/engagements/categories`
      );
      const serializedCategories = categoriesData.map(
        (categoryMap: { [key: string]: any }) =>
          Apiv1CategoryService.engagementSerializer.deserialize(categoryMap)
      );
      return serializedCategories;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
}
