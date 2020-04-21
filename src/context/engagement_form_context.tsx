import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
  useReducer,
  Dispatch,
} from 'react';
import yaml from 'yaml';
import { ConfigContext } from './config_context';
import { AxiosError, AxiosInstance } from 'axios';
import { SessionContext } from './session_context';
import { EngagementContext } from './engagement_context';
import { Engagement } from '../schemas/engagement_schema';

export interface EngagementFormContext {
  getSessionData: (requestHandler: AxiosInstance) => Promise<any>;
  error: AxiosError | null;
  state: any;
  openshiftOptions?: any;
  providerOptions?: any;
  userManagementOptions?: any;
  dispatch: Dispatch<any>;
}

export const EngagementFormContext = createContext<EngagementFormContext>({
  getSessionData: async () => null,
  error: null,
  state: {},
  dispatch: () => {},
});
const { Provider } = EngagementFormContext;

export const EngagementFormProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [requestError, setRequestError] = useState<AxiosError | null>(null);
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const [openshiftOptions, setOpenshiftOptions] = useState<any>();
  const [providerOptions, setProviderOptions] = useState<any>();
  const [userManagementOptions, setUserManagementOptions] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const engagementContext = useContext(EngagementContext);

  const [state, dispatch] = useReducer<(state: any, action: any) => any>(
    formReducer,
    getInitialState(engagementContext.activeEngagement)
  );

  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(engagementContext.activeEngagement),
    });
  }, [engagementContext.activeEngagement]);

  const getSessionData = useCallback(async () => {
    try {
      const { data } = await sessionContext.axios.get(
        `${configContext.appConfig?.backendUrl}/config`
      );
      const parsedData = yaml.parse(data.content);
      setOpenshiftOptions(parsedData['openshift']);
      setProviderOptions(parsedData['providers']);
      setUserManagementOptions(parsedData['user-management']);
    } catch (e) {
      setRequestError(e);
    } finally {
      setIsLoading(false);
    }
  }, [configContext.appConfig, sessionContext.axios]);

  useEffect(() => {
    getSessionData();
  }, [getSessionData]);
  return (
    <Provider
      value={{
        getSessionData,
        openshiftOptions,
        userManagementOptions,
        providerOptions,
        error: requestError,
        state,
        dispatch,
      }}
    >
      {isLoading ? <div /> : children}
    </Provider>
  );
};

const getInitialState = (engagement?: Engagement): Engagement => {
  return {
    project_id: engagement?.project_id ?? null,
    customer_name: engagement?.customer_name ?? null,
    project_name: engagement?.project_name ?? null,
    description: engagement?.description ?? null,
    location: engagement?.location ?? null,
    start_date: engagement?.start_date ?? null,
    end_date: engagement?.end_date ?? null,
    archive_date: engagement?.archive_date ?? null,
    engagement_users: engagement?.engagement_users ?? [],
    engagement_lead_name: engagement?.engagement_lead_name ?? null,
    engagement_lead_email: engagement?.engagement_lead_email ?? null,
    technical_lead_name: engagement?.technical_lead_name ?? null,
    technical_lead_email: engagement?.technical_lead_email ?? null,
    customer_contact_name: engagement?.customer_contact_name ?? null,
    customer_contact_email: engagement?.customer_contact_email ?? null,
    ocp_cloud_provider_name: engagement?.ocp_cloud_provider_name ?? null,
    ocp_cloud_provider_region: engagement?.ocp_cloud_provider_region ?? null,
    ocp_version: engagement?.ocp_version ?? null,
    ocp_sub_domain: engagement?.ocp_sub_domain ?? null,
    ocp_persistent_storage_size:
      engagement?.ocp_persistent_storage_size ?? null,
    ocp_cluster_size: engagement?.ocp_cluster_size ?? null,
  };
};

const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'user':
      return { ...state, engagement_users: action.payload };
    case 'customer_name':
      return { ...state, customer_name: action.payload };
    case 'project_name':
      return { ...state, project_name: action.payload };
    case 'description':
      return { ...state, description: action.payload };
    case 'location':
      return { ...state, location: action.payload };
    case 'start_date':
      return { ...state, start_date: action.payload };
    case 'end_date':
      return { ...state, end_date: action.payload };
    case 'archive_date':
      return { ...state, archive_date: action.payload };
    case 'engagement_lead_name':
      return { ...state, engagement_lead_name: action.payload };
    case 'engagement_lead_email':
      return { ...state, engagement_lead_email: action.payload };
    case 'technical_lead_name':
      return { ...state, technical_lead_name: action.payload };
    case 'technical_lead_email':
      return { ...state, technical_lead_email: action.payload };
    case 'customer_contact_name':
      return { ...state, customer_contact_name: action.payload };
    case 'customer_contact_email':
      return { ...state, customer_contact_email: action.payload };
    case 'ocp_cloud_provider_name':
      return { ...state, ocp_cloud_provider_name: action.payload };
    case 'ocp_cloud_provider_region':
      return { ...state, ocp_cloud_provider_region: action.payload };
    case 'ocp_version':
      return { ...state, ocp_version: action.payload };
    case 'ocp_sub_domain':
      return { ...state, ocp_sub_domain: action.payload };
    case 'ocp_persistent_storage_size':
      return { ...state, ocp_persistent_storage_size: action.payload };
    case 'ocp_cluster_size':
      return { ...state, ocp_cluster_size: action.payload };
    case 'switch_engagement':
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};
