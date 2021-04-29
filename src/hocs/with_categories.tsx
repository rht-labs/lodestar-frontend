import React, { useEffect } from 'react';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useCategories } from '../hooks/use_categories_hook';
import { CategoryWithCount } from '../schemas/engagement_category';
import { CategoryFilter } from '../services/category_service/category_service';

type CategoryComponent<P> = React.FunctionComponent<
  P & {
    categories: CategoryWithCount[];
  }
>;

export function withCategories<P>(
  WrappedComponent: CategoryComponent<P>,
  categoryFilter: CategoryFilter
) {
  return (
    <CategoryFetcher filter={categoryFilter} component={WrappedComponent} />
  );
}

interface CategoryFetcherProps<P> {
  filter: CategoryFilter;
  component: CategoryComponent<P>;
}

const CategoryFetcher = (props: CategoryFetcherProps<any>) => {
  const { component: WrappedComponent, filter } = props;
  const { categoryService } = useServiceProviders();
  const [categories, fetchCategories] = useCategories({ categoryService });
  useEffect(() => {
    fetchCategories(filter);
  }, [fetchCategories, filter]);
  return <WrappedComponent {...props} categories={categories} />;
};
