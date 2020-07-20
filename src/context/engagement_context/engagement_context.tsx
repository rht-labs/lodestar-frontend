import React, { createContext, useEffect } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useState, useCallback, useReducer } from 'react';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import { useServiceProviders } from '../service_provider_context/service_provider_context';
import { useFeedback, AlertType } from '../feedback_context';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError } from '../../services/engagement_service/engagement_service_errors';
import { Logger } from '../../utilities/logger';
import {
  EngagementPoll,
  EngagementPollIntervalStrategy,
} from '../../schemas/engagement_poll';

export interface EngagementContext {
  getEngagements: () => Promise<Engagement[]>;
  currentEngagementChanges?: Engagement;
  currentEngagement?: Engagement;
  setCurrentEngagement: (Engagement: Engagement) => void;
  engagements?: Engagement[];
  requiredFields: string[];
  getEngagement: (
    customerName: string,
    projectName: string
  ) => Promise<Engagement>;
  getConfig: () => void;
  createEngagement: (data: any) => Promise<Engagement>;
  saveEngagement: (data: any) => Promise<void>;
  updateEngagementFormField: (fieldName: string, payload: any) => void;
  missingRequiredFields: string[];
  isLaunchable: boolean;
  formOptions?: EngagementFormConfig;
  error: any;
  isLoading: boolean;
  launchEngagement: (data: any) => Promise<void>;
  createEngagementPoll: (engagement: Engagement) => EngagementPoll;
}
const requiredFields = [
  'customer_contact_email',
  'customer_contact_name',
  'customer_name',
  'end_date',
  'start_date',
  'engagement_lead_email',
  'technical_lead_email',
  'engagement_lead_name',
  'technical_lead_name',
  'ocp_cloud_provider_name',
  'ocp_cloud_provider_region',
  'ocp_version',
  'ocp_cluster_size',
  'ocp_persistent_storage_size',
  'ocp_sub_domain',
  'project_name',
];
export const EngagementContext = createContext<EngagementContext>(null);

const { Provider } = EngagementContext;

export const EngagementProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const feedbackContext = useFeedback();
  const { engagementService } = useServiceProviders();
  const [formOptions, setFormOptions] = useState<EngagementFormConfig>();

  // TODO: Handle error/loading state
  const [error] = useState<any>();
  const [isLoading] = useState<boolean>(false);
  const [engagements, setEngagements] = useState<Engagement[]>(undefined);
  const [currentEngagement, setCurrentEngagement] = useState<
    Engagement | undefined
  >();
  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => any
  >(engagementFormReducer, engagementFormReducer());

  const getConfig = useCallback(async () => {
    const data = await engagementService.getConfig();
    setFormOptions(data);
  }, [engagementService]);

  useEffect(() => {
    Logger.instance.info('change active engagement', currentEngagement);
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(currentEngagement),
    });
  }, [currentEngagement, formOptions]);

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

  const fetchEngagements = useCallback(async () => {
    try {
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
      Logger.instance.error(e);
      feedbackContext.hideLoader();
    }
  }, [engagementService, feedbackContext]);

  const _refreshEngagementData = useCallback(
    async (engagement: Engagement) => {
      const refreshedEngagement = await engagementService.getEngagementByCustomerAndProjectName(
        engagement?.customer_name,
        engagement?.project_name
      );
      _updateEngagementInPlace(refreshedEngagement);
      setCurrentEngagement(refreshedEngagement);
    },
    [_updateEngagementInPlace, engagementService]
  );

  const createEngagementPoll = (engagement: Engagement): EngagementPoll => {
    return new EngagementPoll(
      new EngagementPollIntervalStrategy(
        setInterval(async () => {
          const hasUpdates = await engagementService.checkHasUpdates(
            engagement
          );
          if (hasUpdates) {
            feedbackContext.showAlert(
              'Your data is stale. You will need to refresh your data before you save. Refreshing data will cause current changes to be lost.',
              AlertType.error,
              false,
              [
                {
                  title: 'Refresh',
                  action: () => _refreshEngagementData(engagement),
                },
              ]
            );
          }
        }, 5000)
      )
    );
  };

  const getEngagement = useCallback(
    async (customerName: string, projectName: string) => {
      try {
        let availableEngagements = engagements ?? (await fetchEngagements());
        return availableEngagements?.find(
          engagement =>
            engagement?.customer_name === customerName &&
            engagement?.project_name === projectName
        );
      } catch (e) {
        Logger.instance.error(e);
        feedbackContext.showAlert(
          'There was a problem fetching this engagement',
          AlertType.error
        );
      }
    },
    [engagements, fetchEngagements, feedbackContext]
  );

  const _addNewEngagement = useCallback(
    (newEngagement: Engagement) => {
      try {
        const newEngagementList = [newEngagement, ...(engagements ?? [])];
        setEngagements(newEngagementList);
      } catch (e) {
        Logger.instance.error(e);
        // TODO: Handle setting the error
      }
    },
    [engagements]
  );

  const createEngagement = useCallback(
    async (data: any) => {
      feedbackContext.showLoader();
      try {
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
        Logger.instance.error(e);
        feedbackContext.hideLoader();
        let errorMessage =
          'There was an issue with creating your engagement. Please followup with an administrator if this continues.';
        if (e instanceof AlreadyExistsError) {
          errorMessage =
            'This client already has a project with that name. Please choose a different project name.';
        }
        feedbackContext.showAlert(errorMessage, AlertType.error);
      }
    },
    [engagementService, _addNewEngagement, feedbackContext, engagements]
  );

  const _checkLaunchReady = useCallback(() => {
    let result = requiredFields.every(
      o =>
        typeof currentEngagementChanges[o] === 'boolean' ||
        typeof currentEngagementChanges[o] === 'number' ||
        !!currentEngagementChanges[o]
    );
    return result;
  }, [currentEngagementChanges]);

  const missingRequiredFields = useCallback(() => {
    return requiredFields.filter(
      field =>
        currentEngagement?.[field] !== 'boolean' &&
        currentEngagement?.[field] !== 'number' &&
        !currentEngagement?.[field]
    );
  }, [currentEngagement]);

  const saveEngagement = useCallback(
    async (data: Engagement) => {
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementService.saveEngagement(data);
        feedbackContext.showAlert(
          'Your updates have been successfully saved.',
          AlertType.success
        );
        feedbackContext.hideLoader();
        _updateEngagementInPlace(returnedEngagement);
      } catch (e) {
        Logger.instance.error(e);
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
            errorMessage =
              'Your changes could not be saved. Another user has modified this data. Please refresh your data in order to make changes.';
          }
        }
        feedbackContext.showAlert(errorMessage, AlertType.error);
      }
    },
    [engagementService, _updateEngagementInPlace, feedbackContext]
  );

  const updateEngagementFormField = useCallback(
    (fieldName: string, value: any) => {
      dispatch({ type: fieldName, payload: value });
    },
    [dispatch]
  );

  const launchEngagement = useCallback(
    async (data: any) => {
      if (!_checkLaunchReady()) {
        throw Error(
          'This engagement does not have the required fields to launch'
        );
      }
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementService.launchEngagement(
          data
        );
        _updateEngagementInPlace(returnedEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'You have successfully launched your engagement!',
          AlertType.success
        );
      } catch (e) {
        Logger.instance.error(e);
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'We were unable to launch your engagement. Please followup with an administrator if this continues.',
          AlertType.error,
          false
        );
      }
    },
    [
      _updateEngagementInPlace,
      _checkLaunchReady,
      engagementService,
      feedbackContext,
    ]
  );
  return (
    <Provider
      value={{
        createEngagementPoll,
        requiredFields,
        currentEngagement,
        missingRequiredFields: missingRequiredFields(),
        getConfig,
        isLaunchable: _checkLaunchReady(),
        setCurrentEngagement,
        engagements,
        getEngagement,
        error,
        currentEngagementChanges: {
          ...currentEngagement,
          ...currentEngagementChanges,
        },
        formOptions,
        isLoading,
        updateEngagementFormField,
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

// EngagementProvider.whyDidYouRender = false;
