import {
  CategoryService,
  CategoryFilter,
  CategorySortOrder,
} from '../../services/category_service/category_service';
import { handleAxiosResponseErrors } from './http_error_handlers';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { getApiV1HttpClient } from './client';
import { CategoryWithCount } from '../../schemas/engagement_category';

export class Apiv1CategoryService implements CategoryService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private static engagementSerializer = new EngagementJsonSerializer();

  private buildQueryFromFilter(filter?: CategoryFilter) {
    // example query: engagements/categories?page=10&perPage=5&sortOrder=DESC&suggest=asdf
    let query = '';
    const queryParams = [];
    if (!filter) {
      return query;
    }
    const {
      sortOrder = CategorySortOrder.Descending,
      page = 0,
      perPage = 10,
      searchText = '',
    } = filter;
    if (!!sortOrder) {
      queryParams.push(
        `sortOrder=${
          (sortOrder as CategorySortOrder) === CategorySortOrder.Ascending
            ? 'ASC'
            : 'DESC'
        }`
      );
    }
    queryParams.push(`page=${page})`);
    queryParams.push(`perPage=${perPage}`);
    if (!!searchText) {
      queryParams.push(`suggest=${searchText}`);
    }

    return queryParams.join('&');
  }

  async fetchCategories(filter?: CategoryFilter): Promise<CategoryWithCount[]> {
    const queryString = this.buildQueryFromFilter(filter);
    try {
      const { data: categoriesData } = await this.axios.get(
        `/engagements/categories?${queryString}`
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
