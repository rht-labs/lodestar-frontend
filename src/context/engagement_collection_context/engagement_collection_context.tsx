import { useState } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useServiceProviders } from '../service_provider_context/service_provider_context';
import {
  AlertType,
  IFeedbackContext,
} from '../feedback_context/feedback_context';

export interface EngagementCollectionHookParameters {
  feedbackContext?: IFeedbackContext;
  filter?: EngagementCollectionFilter;
}
interface EngagementCollectionFilter {}
export const useEngagementCollection = ({
  feedbackContext,
  filter,
}: EngagementCollectionHookParameters = {}) => {
  const { engagementService } = useServiceProviders();
  const [engagements, setEngagements] = useState<Partial<Engagement>[]>();
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
    console.log('TODO: filter engagements with:', filter);
    getEngagements();
  };
  return { getEngagements: fetchEngagementsWithParameters, engagements };
};
