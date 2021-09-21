import { useEffect, useState } from 'react';

import { CategoryWithCount } from '../schemas/engagement_category';

export const useCategories = (fetcher: () => Promise<CategoryWithCount[]>) => {
  const [categories, setCategories] = useState<CategoryWithCount[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetcher()
      .then(categories => setCategories(categories))
      .finally(() => setIsLoading(false));
  }, [fetcher]);

return { categories, isLoading };
};
