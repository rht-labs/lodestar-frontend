import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
  useReducer,
} from 'react';
import yaml from 'yaml';
import { ConfigContext } from '../config_context/config_context';
import { AxiosError, AxiosInstance } from 'axios';
import { SessionContext } from '../session_context/session_context';
import { EngagementContext } from './engagement_context';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import { Engagement } from '../../schemas/engagement_schema';

export interface EngagementFormContext {
  getSessionData: (requestHandler: AxiosInstance) => Promise<any>;
  error: AxiosError | null;
  engagementFormState?: Engagement;
  formOptions: {
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  };
  updateFormField: (fieldName: string, payload: any) => void;
}

export const EngagementFormContext = createContext<EngagementFormContext>({
  getSessionData: async () => null,
  error: null,
  engagementFormState: null,
  formOptions: {},
  updateFormField: (fieldName: string, payload: any) => {},
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
  const [formOptions, setFormOptions] = useState<{
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const engagementContext = useContext(EngagementContext);

  const [engagementFormState, dispatch] = useReducer<
    (state: any, action: any) => any
  >(engagementFormReducer, engagementFormReducer());

  const updateFormField = useCallback(
    (fieldName: string, value: any) => {
      dispatch({ type: fieldName, payload: value });
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(engagementContext.activeEngagement),
    });
    if (formOptions.providerOptions) {
      dispatch({
        type: 'ocp_cloud_provider_region',
        payload:
          engagementContext.activeEngagement?.ocp_cloud_provider_region ??
          formOptions.providerOptions[0].regions[0].value,
      });
      dispatch({
        type: 'ocp_cloud_provider_name',
        payload:
          engagementContext.activeEngagement?.ocp_cloud_provider_name ??
          formOptions.providerOptions[0].value,
      });
    }
    if (formOptions.openshiftOptions) {
      dispatch({
        type: 'ocp_cluster_size',
        payload:
          engagementContext.activeEngagement?.ocp_cluster_size ??
          formOptions.openshiftOptions['cluster-size'][0].value,
      });
      dispatch({
        type: 'ocp_version',
        payload:
          engagementContext.activeEngagement?.ocp_version ??
          formOptions.openshiftOptions.versions[0].value,
      });
    }
  }, [engagementContext.activeEngagement, formOptions]);

  const getSessionData = useCallback(async () => {
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
        formOptions,
        error: requestError,
        engagementFormState,
        updateFormField,
      }}
    >
      {isLoading ? <div /> : children}
    </Provider>
  );
};
