import React, { createContext, useContext, useState } from 'react';
import { EngagementCategory } from '../../schemas/engagement_category';
import { CategoryService } from '../../services/category_service/category_service';

export interface ICategoryContext {
  fetchCategories: () => void;
  categories: EngagementCategory[];
}

export const CategoryContext = createContext<ICategoryContext>({
  fetchCategories: () => {},
  categories: [],
});

export interface CategoryProviderProps {
  categoryService: CategoryService;
  children: React.ReactNode;
}

export const CategoryProvider = ({
  children,
  categoryService,
}: CategoryProviderProps) => {
  const [categories, setCategories] = useState<EngagementCategory[]>([]);
  const fetchCategories = async () => {
    const fetched = await categoryService.fetchCategories();
    setCategories(fetched);
  };
  <CategoryContext.Provider value={{ categories, fetchCategories }}>
    {children}
  </CategoryContext.Provider>;
};

export const useCategories = () => {
  const { categories, fetchCategories } = useContext(CategoryContext);
  return { categories, fetchCategories };
};
