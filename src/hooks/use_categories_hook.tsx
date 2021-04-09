import { useCallback, useState } from 'react';
import { CategoryWithCount } from '../schemas/engagement_category';
import {
  CategoryFilter,
  CategoryService,
} from '../services/category_service/category_service';

export interface CategoryHookParameters {
  categoryService: CategoryService;
}
export interface CategoryHookFetchParameters extends CategoryFilter {}

export const useCategories = ({
  categoryService,
}: CategoryHookParameters): [
  CategoryWithCount[],
  (params?: CategoryHookFetchParameters) => void
] => {
  const [categories = [], setCategories] = useState<CategoryWithCount[]>([]);
  const getCategories = useCallback(
    async (parameters?: CategoryHookFetchParameters) => {
      const result = await categoryService.fetchCategories(parameters);
      setCategories(result);
    },
    [setCategories, categoryService]
  );
  return [categories, getCategories];
};
