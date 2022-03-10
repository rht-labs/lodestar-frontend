import React, { createContext, useContext, useState } from 'react';
import { EngagementCategory } from '../../schemas/engagement_category';
import { CategoryFilter, CategoryService } from '../../services/category_service/category_service';

export interface ICategoryContext {
  fetchCategories: () => void;
  categories: EngagementCategory[];
}

export const CategoryContext = createContext<ICategoryContext>({
  fetchCategories: (filter?: CategoryFilter) => {},
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
  const fetchCategories = async (filter?: CategoryFilter) => {
    const fetched = await categoryService.fetchCategories(filter);
    setCategories(fetched);
  };
  return (
    <CategoryContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const { categories = [], fetchCategories } = useContext(CategoryContext);
  return { categories, fetchCategories };
};
