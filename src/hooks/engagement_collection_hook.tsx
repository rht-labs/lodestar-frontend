import { useCallback, useState } from 'react';
import { Engagement, EngagementStatus } from '../schemas/engagement';
import {
  AlertType,
  IFeedbackContext,
} from '../context/feedback_context/feedback_context';
import {
  EngagementService,
  SortOrder,
} from '../services/engagement_service/engagement_service';

export interface EngagementCollectionHookParameters {
  feedbackContext?: IFeedbackContext;
  filter?: EngagementCollectionFilter;
  engagementService: EngagementService;
}

export interface EngagementCollectionFilter {
  engagementRegions?: string[];
  engagementStatuses?: EngagementStatus[];
  startDate?: Date;
  endDate?: Date;
  include?: Array<keyof Engagement>;
  exclude?: Array<keyof Engagement>;
  perPage?: number;
  pageNumber?: number;
  sortField?: keyof Engagement | 'last_update';
  sortOrder?: SortOrder;
}
export const useEngagementCollection = ({
  feedbackContext,
  engagementService,
}: EngagementCollectionHookParameters) => {
  const [engagements = [], setEngagements] = useState<Partial<Engagement>[]>(
    []
  );
  const getEngagements = useCallback(
    async (filter: EngagementCollectionFilter = {}) => {
      feedbackContext?.showLoader();
      try {
        const engagements = await engagementService.fetchEngagements({
          endDate: filter?.endDate,
          startDate: filter?.startDate,
          engagementStatuses: filter?.engagementStatuses,
          regions: filter?.engagementRegions,
          include: filter?.include,
          exclude: filter?.exclude,
          perPage: filter?.perPage,
          pageNumber: filter?.pageNumber,
          sortField: filter?.sortField,
          sortOrder: filter?.sortOrder,
        });
        setEngagements(engagements);
      } catch (e) {
        feedbackContext?.showAlert(
          'Something went wrong while fetching the engagements',
          AlertType.error,
          true
        );
      } finally {
        feedbackContext?.hideLoader();
      }
    },
    [engagementService, feedbackContext]
  );
  return { getEngagements, engagements };
};
