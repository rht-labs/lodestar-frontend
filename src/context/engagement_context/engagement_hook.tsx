import {
  useState,
  useContext,
  useCallback,
  useReducer,
  useEffect,
} from 'react';
import { ConfigContext } from '../config_context/config_context';
import { SessionContext } from '../session_context/session_context';
import { Apiv1EngagementService } from '../../services/engagement_service/implementations/apiv1_engagement_service';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { Engagement } from '../../schemas/engagement_schema';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import { FeedbackContext } from '../feedback_context';

export const useEngagements = (
  props: {
    engagementService?: EngagementService;
  } = {}
) => {
  const feedbackContext = useContext(FeedbackContext);
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const engagementRepository =
    props.engagementService ??
    new Apiv1EngagementService({
      baseUrl: configContext.appConfig?.backendUrl,
      axios: sessionContext.axios,
    });
  const [formOptions, setFormOptions] = useState<{
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  }>({});
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
    const data = await engagementRepository.getConfig();
    setFormOptions(data);
  }, [engagementRepository]);

  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(activeEngagement),
    });
    if (formOptions.providerOptions) {
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
    if (formOptions.openshiftOptions) {
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
    }
  }, [activeEngagement, formOptions]);

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
        const engagement = await engagementRepository.createEngagement(data);
        _addNewEngagement(engagement);
        setActiveEngagement(engagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'Your engagement has been successfully created',
          'success'
        );
      } catch (e) {
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'There was an issue with creating your engagement. Please followup with an administrator if this continues.',
          'error'
        );
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
        feedbackContext.showAlert(
          'Your updates have been successfully saved.',
          'success'
        );
        feedbackContext.hideLoader();
        _updateEngagementInPlace(returnedEngagement);
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'There was an issue with saving your changes. Please followup with an administrator if this continues.',
          'error'
        );
      }
    },
    [engagementRepository, _updateEngagementInPlace, feedbackContext]
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
        const returnedEngagement = await engagementRepository.launchEngagement(
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
    [_updateEngagementInPlace, engagementRepository, feedbackContext]
  );

  return {
    engagements,
    setActiveEngagement,
    activeEngagement,
    error,
    engagementFormState,
    formOptions,
    isLoading,
    getConfig,
    updateEngagementFormField,
    fetchEngagements,
    createEngagement,
    saveEngagement,
    launchEngagement,
  };
};
