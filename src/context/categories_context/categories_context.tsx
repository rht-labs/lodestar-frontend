import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSession } from '../auth_context/auth_context';
import {
  AuthorizationError,
  AuthenticationError,
} from '../../services/auth_service/auth_errors';
import { CategoriesService } from '../../services/categories_service/categories_service';
import { EngagementCategory } from "../../schemas/engagement_category";
import { useFeedback } from "../feedback_context/feedback_context";

export interface CategoriesContext {
  fetchCategories: () => void;
  categories?: EngagementCategory[]
}

export const CategoriesContext = createContext<CategoriesContext>({
  fetchCategories: async () => {},
  categories: []
});
const { Provider } = CategoriesContext;
export const CategoriesProvider = ({
  children,
  categoriesService,
}: {
  children: React.ReactChild;
  categoriesService: CategoriesService;
}) => {
  const authContext = useSession();
  const [categories, setCategories] = useState<EngagementCategory[]>([]);
  const _handleErrors = useCallback(
    e => {
      if (e instanceof AuthorizationError || e instanceof AuthenticationError) {
        authContext.isAuthenticated();
      } else {
        throw e;
      }
    },
    [authContext]
  );
  const feedbackContext = useFeedback();
  const fetchCategories = useCallback(async () => {
    try {
      feedbackContext.showLoader();
      const categories = await categoriesService.fetchCategories();
      setCategories(categories);
      feedbackContext.hideLoader();
    } catch (e) {
      try {
        _handleErrors(e);
      } catch (e) {
        throw e;
      }
    }
  }, [categoriesService, feedbackContext, _handleErrors]);

  return (
    <Provider
      value={{
        fetchCategories,
        categories
      }}
    >
      {children}
    </Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
