import { useState } from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  AlertType,
  IFeedbackContext,
} from '../feedback_context/feedback_context';
import { EngagementService } from '../../services/engagement_service/engagement_service';

export interface EngagementCollectionHookParameters {
  feedbackContext?: IFeedbackContext;
  filter?: EngagementCollectionFilter;
  engagementService: EngagementService;
}
interface EngagementCollectionFilter {
  minDate?: Date;
  maxDate?: Date;
}
export const useEngagementCollection = ({
  feedbackContext,
  filter,
  engagementService,
}: EngagementCollectionHookParameters) => {
  const [engagements, setEngagements] = useState<Partial<Engagement>[]>([]);
  const getEngagements = async () => {
    feedbackContext?.showLoader();
    try {
      const engagements = await engagementService.fetchEngagements();
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
  };
  const fetchEngagementsWithParameters = () => {
    // TODO: Implement filters here
    getEngagements();
  };
  return { getEngagements: fetchEngagementsWithParameters, engagements };
};
