import React, { createContext, useContext, useState } from 'react';
import { Engagement } from '../../schemas/engagement';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import {
  AlertType,
  IFeedbackContext,
} from '../feedback_context/feedback_context';

export interface IEngagementCollectionContext {
  engagements: Partial<Engagement>[];
  getEngagements: () => void;
}

export const EngagementCollectionContext = createContext<
  IEngagementCollectionContext
>({
  engagements: [],
  getEngagements: () => {},
});

export interface IEngagementCollectionProviderProps {
  engagementService: EngagementService;
  feedbackContext: IFeedbackContext;
  children: any;
}
export const EngagementCollectionProvider = ({
  engagementService,
  feedbackContext,
  children,
}: IEngagementCollectionProviderProps) => {
  const [engagements, setEngagements] = useState<Partial<Engagement>[]>([]);
  const getEngagements = async () => {
    feedbackContext.showLoader();
    try {
      const engagements = await engagementService.fetchEngagements();
      setEngagements(engagements);
    } catch (e) {
      feedbackContext.showAlert(
        'Something went wrong while fetching the engagements',
        AlertType.error,
        true
      );
    } finally {
      feedbackContext.hideLoader();
    }
  };
  return (
    <EngagementCollectionContext.Provider
      value={{
        engagements,
        getEngagements,
      }}
    >
      {children}
    </EngagementCollectionContext.Provider>
  );
};

interface EngagementCollectionFilter {}
export const useEngagementCollection = (
  filter?: EngagementCollectionFilter
) => {
  const { getEngagements, engagements } = useContext(
    EngagementCollectionContext
  );
  const fetchEngagementsWithParameters = () => {
    console.log('TODO: filter engagements with:', filter);
    getEngagements();
  };
  return { getEngagements: fetchEngagementsWithParameters, engagements };
};
