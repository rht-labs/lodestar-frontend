import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Apiv1EngagementService } from '../../services/engagement_service/implementations/apiv1_engagement_service';
import { ConfigContext } from '../config_context/config_context';
import { SessionContext } from '../session_context/session_context';
import yaml from 'yaml';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
export interface EngagementContext {
  getEngagements: () => void;
  engagementFormState?: Engagement;
  activeEngagement?: Engagement;
  setActiveEngagement: (Engagement: Engagement) => void;
  engagements: Engagement[];
  createEngagement: (data: any) => Promise<void>;
  saveEngagement: (data: any) => Promise<void>;
  updateEngagementField: (fieldName: string, payload: any) => void;

  formOptions?: {
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  };
  error: any;
  isLoading: boolean;
  launchEngagement: (data: any) => Promise<void>;
}

export const EngagementContext = createContext<EngagementContext>({
  getEngagements: async () => [],
  formOptions: {},
  activeEngagement: undefined,
  error: null,
  updateEngagementField: (fieldName: string, payload: any) => {},
  isLoading: false,
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
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const engagementRepository = new Apiv1EngagementService({
    baseUrl: configContext.appConfig?.backendUrl,
    axios: sessionContext.axios,
  });
  const [formOptions, setFormOptions] = useState<{
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  }>({});
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [activeEngagement, setActiveEngagement] = useState<
    Engagement | undefined
  >();
  const getFormOptions = useCallback(async () => {
    try {
      const { data } = await sessionContext.axios.get(
        `${configContext.appConfig?.backendUrl}/config`
      );
      const parsedData = yaml.parse(data.content);
      setFormOptions({
        openshiftOptions: parsedData['openshift'],
        providerOptions: parsedData['providers'],
        userManagementOptions: parsedData['user-management'],
      });
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [configContext.appConfig, sessionContext.axios]);
  const [engagementFormState, dispatch] = useReducer<
    (state: any, action: any) => any
  >(engagementFormReducer, engagementFormReducer());

  useEffect(() => {
    getFormOptions();
  }, [getFormOptions]);

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
    const engagements = await engagementRepository.fetchEngagements();
    setEngagements(engagements);
    if (engagements.length > 0) {
      setActiveEngagement(engagements[0]);
    }
  }, [engagementRepository]);

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
      try {
        const engagement = await engagementRepository.createEngagement(data);
        _addNewEngagement(engagement);
        setActiveEngagement(engagement);
      } catch (e) {}
    },
    [engagementRepository, _addNewEngagement]
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
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementRepository.saveEngagement(
          data
        );
        _updateEngagementInPlace(returnedEngagement);
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        // TODO: Add error state
      }
    },
    [engagementRepository, _updateEngagementInPlace]
  );

  const showSuccessMessage = () => {
    console.log('success');
    //TODO: Once interaction feedback system is worked out - implement here
  };

  const updateEngagementField = useCallback(
    (fieldName: string, value: any) => {
      dispatch({ type: fieldName, payload: value });
    },
    [dispatch]
  );

  const showErrorMessage = () => {
    console.log('error');
    //TODO: Once interaction feedback system is worked out - implement here
  };

  const launchEngagement = useCallback(
    async (data: any) => {
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        const returnedEngagement = await engagementRepository.launchEngagement(
          data
        );
        _updateEngagementInPlace(returnedEngagement);
        showSuccessMessage();
        setActiveEngagement(returnedEngagement);
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        showErrorMessage();
      }
    },
    [_updateEngagementInPlace, engagementRepository]
  );

  return (
    <Provider
      value={{
        activeEngagement,
        setActiveEngagement,
        engagements,
        error,
        engagementFormState,
        isLoading,
        formOptions,
        updateEngagementField,
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
