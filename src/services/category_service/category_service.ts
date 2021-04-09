import { EngagementCategory } from '../../schemas/engagement_category';

export enum CategorySortOrder {
  Ascending,
  Descending,
}
export interface CategoryFilter {
  page?: number;
  perPage?: number;
  sortOrder?: CategorySortOrder;
  searchText?: string;
}

export interface CategoryWithCount extends EngagementCategory {
  count: number;
}
export abstract class CategoryService {
  abstract fetchCategories(
    filter?: CategoryFilter
  ): Promise<CategoryWithCount[]>;
}
