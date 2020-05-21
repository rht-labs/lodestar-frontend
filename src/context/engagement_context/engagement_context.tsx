import React, { createContext } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import {
  useState,
  useContext,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import { ServiceProviderContext } from '../service_provider_context/service_provider_context';
import { FeedbackContext } from '../feedback_context';

export interface EngagementContext {
  getEngagements: () => void;
  engagementFormState?: Engagement;
  activeEngagement?: Engagement;
  setActiveEngagement: (Engagement: Engagement) => void;
  engagements: Engagement[];
  getConfig: () => void;
  createEngagement: (data: any) => Promise<void>;
  saveEngagement: (data: any) => Promise<void>;
  updateEngagementFormField: (fieldName: string, payload: any) => void;
  isLaunchable: boolean;

  formOptions?: {
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  };
  error: any;
  isLoading: boolean;
  launchEngagement: (data: any) => Promise<void>;
}

export const EngagementContext = createContext<EngagementContext>(null);

const { Provider } = EngagementContext;

export const EngagementProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const feedbackContext = useContext(FeedbackContext);
  const engagementService = useContext(ServiceProviderContext)
    .engagementService;
  const [formOptions, setFormOptions] = useState<
    | {
        openshiftOptions?: any;
        providerOptions?: any;
        userManagementOptions?: any;
      }
    | undefined
  >();
  // TODO: Handle error/loading state
  const [error] = useState<any>();
  const [isLoading] = useState<boolean>(false);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [activeEngagement, setActiveEngagement] = useState<
    Engagement | undefined
  >();
  const [engagementFormState, dispatch] = useReducer<
    (state: any, action: any) => any
  >(engagementFormReducer, engagementFormReducer());

  const getConfig = useCallback(async () => {
    const data = await engagementService.getConfig();
    setFormOptions(data);
  }, [engagementService]);

  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(activeEngagement),
    });
    if (formOptions?.providerOptions) {
      dispatch({
        type: 'ocp_cloud_provider_region',
        payload:
          activeEngagement?.ocp_cloud_provider_region ??
          formOptions.providerOptions[0].regions[0].value,
      });
      dispatch({
        type: 'ocp_cloud_provider_name',
        payload:
          activeEngagement?.ocp_cloud_provider_name ??
          formOptions.providerOptions[0].value,
      });
    }
    if (formOptions?.openshiftOptions) {
      dispatch({
        type: 'ocp_cluster_size',
        payload:
          activeEngagement?.ocp_cluster_size ??
          formOptions.openshiftOptions['cluster-size'][0].value,
      });
      dispatch({
        type: 'ocp_version',
        payload:
          activeEngagement?.ocp_version ??
          formOptions.openshiftOptions.versions[0].value,
      });
      dispatch({
        type: 'ocp_persistent_storage_size',
        payload:
          activeEngagement?.ocp_persistent_storage_size ??
          formOptions.openshiftOptions?.['persistent-storage'][0].value,
      });
    }
  }, [activeEngagement, formOptions]);

  const fetchEngagements = useCallback(async () => {
    feedbackContext.showLoader();
    const engagements = await engagementService.fetchEngagements();
    setEngagements(engagements);
    if (engagements.length > 0) {
      setActiveEngagement(engagements[0]);
    }
    feedbackContext.hideLoader();
  }, [engagementService, feedbackContext]);

  const _addNewEngagement = useCallback(
    (newEngagement: Engagement) => {
      try {
        const newEngagementList = [newEngagement, ...engagements];
        setEngagements(newEngagementList);
      } catch (e) {
        console.error(e);
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
        setActiveEngagement(engagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'Your engagement has been successfully created',
          'success'
        );
      } catch (e) {
        feedbackContext.hideLoader();
        let errorMessage =
          'There was an issue with creating your engagement. Please followup with an administrator if this continues.';
        if (e.reponse.status === 409) {
          errorMessage =
            'This client already has a project with that name. Please choose another.';
        }
        feedbackContext.showAlert(errorMessage, 'error');
      }
    },
    [engagementService, _addNewEngagement, feedbackContext]
  );

  const _checkLaunchReady = () => {
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
    let result = requiredFields.every(
      o =>
        typeof engagementFormState[o] === 'boolean' || !!engagementFormState[o]
    );
    return result;
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
    async (data: any) => {
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementService.saveEngagement(data);
        feedbackContext.showAlert(
          'Your updates have been successfully saved.',
          'success'
        );
        feedbackContext.hideLoader();
        _updateEngagementInPlace(returnedEngagement);
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        let errorMessage =
          'There was an issue with saving your changes. Please followup with an administrator if this continues.';
        if (e.response.status === 409) {
          errorMessage =
            'The path that you input is already taken.  Please update and try saving again.';
        }
        feedbackContext.showAlert(errorMessage, 'error');
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
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementService.launchEngagement(
          data
        );
        _updateEngagementInPlace(returnedEngagement);
        setActiveEngagement(returnedEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'You have successfully launched your engagement!',
          'success'
        );
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'We were unable to launch your engagement. Please followup with an administrator if this continues.',
          'error',
          false
        );
      }
    },
    [_updateEngagementInPlace, engagementService, feedbackContext]
  );
  return (
    <Provider
      value={{
        activeEngagement,
        getConfig,
        isLaunchable: _checkLaunchReady(),
        setActiveEngagement,
        engagements,
        error,
        engagementFormState,
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
