import React, { useEffect } from 'react';
import { useServiceProviders } from '../../context/service_provider_context/service_provider_context';
import { useCategories } from '../../hooks/use_categories_hook';
import { CategoryWithCount } from '../../schemas/engagement_category';
import { CategoryFilter } from '../../services/category_service/category_service';

export function withCategories<P>(
  WrappedComponent: React.FunctionComponent<
    P & {
      categories: CategoryWithCount[];
    }
  >,
  categoryFilter: CategoryFilter
) {
  return (props: P) => {
    const { categoryService } = useServiceProviders();
    const [categories, fetchCategories] = useCategories({ categoryService });
    useEffect(() => {
      fetchCategories(categoryFilter);
    }, [fetchCategories]);
    return <WrappedComponent {...props} categories={categories} />;
  };
}
