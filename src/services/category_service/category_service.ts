import { CategoryWithCount } from '../../schemas/engagement_category';

export enum CategorySortOrder {
  Ascending,
  Descending,
}
export interface CategoryFilter {
  page?: number;
  perPage?: number;
  sortOrder?: CategorySortOrder;
  searchText?: string;
  startDate?: Date;
  endDate?: Date;
  regions?: string[];
}

export abstract class CategoryService {
  abstract fetchCategories(
    filter?: CategoryFilter
  ): Promise<CategoryWithCount[]>;
}
