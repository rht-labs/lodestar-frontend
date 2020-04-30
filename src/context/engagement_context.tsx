import React, { createContext, useState, useCallback, useContext } from 'react';
import { Engagement } from '../schemas/engagement_schema';
import { Apiv1EngagementService } from '../services/engagement_service/implementations/apiv1_engagement_service';
import { ConfigContext } from './config_context';
import { SessionContext } from './session_context';
import { FeedbackContext } from './feedback_context';

export interface EngagementContext {
  getEngagements: () => void;
  activeEngagement?: Engagement;
  setActiveEngagement: (Engagement: Engagement) => void;
  engagements: Engagement[];
  createEngagement: (data: any) => Promise<void>;
  saveEngagement: (data: any) => Promise<void>;
  launchEngagement: (data: any) => Promise<void>;
}

export const EngagementContext = createContext<EngagementContext>({
  getEngagements: async () => [],
  activeEngagement: undefined,
  setActiveEngagement: (engagement: Engagement) => {},
  engagements: [],
  createEngagement: async () => {},
  saveEngagement: async () => {},
  launchEngagement: async () => {},
});
const { Provider } = EngagementContext;
export const EngagementProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const feedbackContext = useContext(FeedbackContext);
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const engagementRepository = new Apiv1EngagementService({
    baseUrl: configContext.appConfig?.backendUrl,
    axios: sessionContext.axios,
  });

  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [activeEngagement, setActiveEngagement] = useState<
    Engagement | undefined
  >();
  const fetchEngagements = useCallback(async () => {
    feedbackContext.showLoader();
    const engagements = await engagementRepository.fetchEngagements();
    setEngagements(engagements);
    if (engagements.length > 0) {
      setActiveEngagement(engagements[0]);
    }
    feedbackContext.hideLoader();
  }, [engagementRepository, feedbackContext]);

  const _addNewEngagement = useCallback(
    (newEngagement: Engagement) => {
      try {
        const newEngagementList = [newEngagement, ...engagements];
        setEngagements(newEngagementList);
      } catch (e) {
        // TODO: Handle setting the error
      }
    },
    [engagements]
  );

  const createEngagement = useCallback(
    async (data: any) => {
      feedbackContext.showLoader();
      try {
        const engagement = await engagementRepository.createEngagement(data);
        _addNewEngagement(engagement);
        setActiveEngagement(engagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert("Your engagement has been successfully created", "success");
      } catch (e) {
        feedbackContext.hideLoader();
        feedbackContext.showAlert("There was an issue with creating your engagement. Please followup with an administrator if this continues.", "error");
      }
    },
    [engagementRepository, _addNewEngagement, feedbackContext]
  );

  const _updateEngagementInPlace = useCallback(
    engagement => {
      const oldEngagementIndex = engagements.findIndex(comparisonEngagement => {
        if (
          engagement?.project_name &&
          engagement?.customer_name &&
          engagement?.project_name === comparisonEngagement?.project_name &&
          engagement?.customer_name === comparisonEngagement?.customer_name
        ) {
          return true;
        }
        return false;
      });
      const oldEngagement = engagements[oldEngagementIndex];
      if (oldEngagementIndex > -1) {
        const newEngagements = [...engagements];
        newEngagements.splice(oldEngagementIndex, 1, engagement);
        setEngagements(newEngagements);
      }
      return oldEngagement;
    },
    [engagements]
  );

  const saveEngagement = useCallback(
    async (data: any) => {
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementRepository.saveEngagement(
          data
        );
        feedbackContext.hideLoader();
        _updateEngagementInPlace(returnedEngagement);
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert("There was an issue with saving your changes. Please followup with an administrator if this continues.", "error");
      }
    },
    [engagementRepository, _updateEngagementInPlace, feedbackContext]
  );

  const launchEngagement = useCallback(
    async (data: any) => {
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementRepository.launchEngagement(data);
        _updateEngagementInPlace(returnedEngagement);
        setActiveEngagement(returnedEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert("You have successfully launched your cluster!", "success");
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert("We were unable to launch your cluster. Please followup with an administrator if this continues.", "error");
      }
    },
    [_updateEngagementInPlace, engagementRepository, feedbackContext]
  );

  return (
    <Provider
      value={{
        activeEngagement,
        setActiveEngagement,
        engagements,
        // TODO: add error state
        getEngagements: fetchEngagements,
        createEngagement,
        saveEngagement,
        launchEngagement,
      }}
    >
      {children}
    </Provider>
  );
};
