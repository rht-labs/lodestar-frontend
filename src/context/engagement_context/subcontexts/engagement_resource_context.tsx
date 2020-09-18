import React, { useContext, useState, useCallback } from 'react';
import { EngagementService } from '../../../services/engagement_service/engagement_service';
import {
  FeedbackContext,
  AlertType,
} from '../../feedback_context/feedback_context';
import { Engagement } from '../../../schemas/engagement';
import { EngagementErrorContext } from './engagement_error_context';
import { EngagementAuthMediatorContext } from './engagement_auth_mediator';
import { AlreadyExistsError } from '../../../services/engagement_service/engagement_service_errors';
import { Logger } from '../../../utilities/logger';

export type CreateEngagementParams = Pick<
  Engagement,
  'project_name' | 'customer_name' | 'engagement_region'
>;
export interface EngagementResourceContext {
  saveEngagement: (data: any) => Promise<Engagement>;
  getEngagements: () => Promise<Engagement[]>;
  engagements?: Engagement[];
  getEngagement: (
    customerName: string,
    projectName: string
  ) => Promise<Engagement>;
  createEngagement: (data: any) => Promise<Engagement>;
  launchEngagement: (data: Engagement) => Promise<Engagement>;
}

export const EngagementResourceContext = React.createContext<
  EngagementResourceContext
>(null);

interface EngagementResourceContextProvider {
  children: any;
  engagementService: EngagementService;
  feedbackContext: FeedbackContext;
}
export const EngagementResourceContextProvider = ({
  children,
  feedbackContext,
  engagementService,
}: EngagementResourceContextProvider) => {
  const { validateAuthStatus } = useContext(EngagementAuthMediatorContext);
  const { checkErrors } = useContext(EngagementErrorContext);
  const [engagements, setEngagements] = useState<Engagement[]>([]);

  const launchEngagement = async (data: Engagement) => {
    const oldEngagement = _updateEngagementInPlace(data);
    try {
      await validateAuthStatus();
      const returnedEngagement = await engagementService.launchEngagement(data);
      _updateEngagementInPlace(returnedEngagement);
      feedbackContext.hideLoader();
      feedbackContext.showAlert(
        'You have successfully launched your engagement!',
        AlertType.success
      );
      return returnedEngagement;
    } catch (e) {
      _updateEngagementInPlace(oldEngagement);
      feedbackContext.hideLoader();
      feedbackContext.showAlert(
        'We were unable to launch your engagement. Please follow up with an administrator if this continues.',
        AlertType.error,
        false
      );
      await checkErrors(e);
    }
  };
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
    async (data: Engagement) => {
      feedbackContext.showLoader();
      // TODO: Reimplement
      // const commitMessage = _createCommitMessage(changedFields, fieldGroups);
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        await validateAuthStatus();
        const returnedEngagement = await engagementService.saveEngagement(
          data,
          //    commitMessage
          ''
        );
        feedbackContext.showAlert(
          'Your updates have been successfully saved.',
          AlertType.success
        );
        feedbackContext.hideLoader();
        _updateEngagementInPlace(returnedEngagement);
        return returnedEngagement;
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        let errorMessage =
          'There was an issue with saving your changes. Please followup with an administrator if this continues.';
        if (e instanceof AlreadyExistsError) {
          // If there is no mongo id associated with the engagement, then it is being committed to the backend for the first time. It is a net new engagement.
          if (!!data.mongo_id) {
            errorMessage =
              'The path that you input is already taken.  Please update and try saving again.';

            // Otherwise, we are saving an existing engagement.
          } else {
            await checkErrors(e);
            errorMessage =
              'Your changes could not be saved. Another user has modified this data. Please refresh your data in order to make changes.';
          }
        }
        feedbackContext.showAlert(errorMessage, AlertType.error);
      }
    },
    [
      _updateEngagementInPlace,
      checkErrors,
      engagementService,
      feedbackContext,
      validateAuthStatus,
    ]
  );
  const getEngagements = useCallback(async () => {
    try {
      await validateAuthStatus();
      feedbackContext.showLoader();
      const engagements = await engagementService.fetchEngagements();
      setEngagements(engagements);
      feedbackContext.hideLoader();
      return engagements;
    } catch (e) {
      feedbackContext.showAlert(
        'Something went wrong while getting the engagements',
        AlertType.error,
        true
      );
      feedbackContext.hideLoader();
      await checkErrors(e);
    }
  }, [checkErrors, engagementService, feedbackContext, validateAuthStatus]);
  const getEngagement = useCallback(
    async (customerName: string, projectName: string) => {
      try {
        // let availableEngagements = engagements ?? [];
        // let cachedEngagement = availableEngagements?.find(
        //   engagement =>
        //     engagement?.customer_name === customerName &&
        //     engagement?.project_name === projectName
        // );
        // TODO: reimplement
        // if (cachedEngagement !== null) {
        //   setCurrentEngagement(cachedEngagement);
        // }
        let fetchedEngagement = await engagementService.getEngagementByCustomerAndProjectName(
          customerName,
          projectName
        );
        return fetchedEngagement;
      } catch (e) {
        try {
          await checkErrors(e);
        } catch (e) {
          feedbackContext.showAlert(
            'There was a problem fetching this engagement',
            AlertType.error
          );
        }
      }
    },
    [engagementService, checkErrors, feedbackContext]
  );
  const _addNewEngagement = useCallback(
    async (newEngagement: Engagement) => {
      try {
        const newEngagementList = [newEngagement, ...(engagements ?? [])];
        setEngagements(newEngagementList);
      } catch (e) {
        await checkErrors(e);
        Logger.instance.error(e);
      }
    },
    [checkErrors, engagements]
  );

  const createEngagement = useCallback(
    async (data: CreateEngagementParams) => {
      feedbackContext.showLoader();
      try {
        await validateAuthStatus();
        const engagement = await engagementService.createEngagement(data);
        _addNewEngagement(engagement);
        setEngagements([...(engagements ?? []), engagement]);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'Your engagement has been successfully created',
          AlertType.success
        );
        return engagement;
      } catch (e) {
        feedbackContext.hideLoader();
        let errorMessage;
        if (e instanceof AlreadyExistsError) {
          errorMessage =
            'This client already has a project with that name. Please choose a different project name.';
        } else {
          try {
            await checkErrors(e);
          } catch (e) {
            errorMessage =
              'There was an issue with creating your engagement. Please follow up with an administrator if this continues.';
          }
        }

        feedbackContext.showAlert(errorMessage, AlertType.error);
        await checkErrors(e);
      }
    },
    [
      feedbackContext,
      validateAuthStatus,
      engagementService,
      _addNewEngagement,
      engagements,
      checkErrors,
    ]
  );
  return (
    <EngagementResourceContext.Provider
      value={{
        saveEngagement,
        getEngagement,
        createEngagement,
        getEngagements,
        launchEngagement,
        engagements,
      }}
    >
      {children}
    </EngagementResourceContext.Provider>
  );
};
