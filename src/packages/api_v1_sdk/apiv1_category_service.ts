import {
  CategoryService,
  CategoryFilter,
  CategorySortOrder,
} from '../../services/category_service/category_service';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { getApiV1HttpClient } from './client';
import { CategoryWithCount } from '../../schemas/engagement_category';
import { ConsoleLogger } from '../../utilities/logger/loggers';
import { LogVerbosity } from '../../utilities/logger/logger';

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
      page = 1,
      perPage = 10,
      endDate,
      startDate,
      regions = [],
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
    queryParams.push(`page=${page}`);
    queryParams.push(`perPage=${perPage}`);
    const searchParams = [];
    if (startDate != null) {
      searchParams.push(`start=${startDate.toISOString().split('T')[0]}`);
    }
    if (endDate != null) {
      searchParams.push(`start=${endDate.toISOString().split('T')[0]}`);
    }
    if (regions.length > 0) {
      searchParams.push(`engagement_region=${regions.join(',')}`);
    }
    if (searchText.length > 0) {
      searchParams.push(`categories.name like ${searchText}`);
    }
    if (searchParams.length > 0) {
      queryParams.push(`search=${searchParams.join('&')}`);
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
      ConsoleLogger(LogVerbosity.error).error("fetch category failure", e);
    }
  }
}
