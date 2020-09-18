import React, { createContext, useEffect, useRef, useContext } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useState, useCallback, useReducer } from 'react';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import {
  useFeedback,
  AlertType,
  FeedbackContext,
} from '../feedback_context/feedback_context';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError } from '../../services/engagement_service/engagement_service_errors';
import { Logger } from '../../utilities/logger';
import { AuthenticationError } from '../../services/auth_service/auth_errors';
import { useSession, AuthContext } from '../auth_context/auth_context';
import {
  EngagementPoll,
  EngagementPollIntervalStrategy,
} from '../../schemas/engagement_poll';
import { EngagementService } from '../../services/engagement_service/engagement_service';

interface EngagementAuthMediatorContext {
  validateAuthStatus: () => Promise<void>;
}
const EngagementAuthMediatorContext = React.createContext<
  EngagementAuthMediatorContext
>(null);
interface EngagementAuthMediatorContextProviderProps {
  children: any;
  authContext: AuthContext;
}

const EngagementAuthMediatorContextProvider = ({
  children,
  authContext,
}: EngagementAuthMediatorContextProviderProps) => {
  const validateAuthStatus = useCallback(async () => {
    if (!(await authContext.checkIsAuthenticated())) {
      authContext.setAuthError(new AuthenticationError());
      throw new AuthenticationError();
    }
  }, [authContext]);
  return (
    <EngagementAuthMediatorContext.Provider value={{ validateAuthStatus }}>
      {children}
    </EngagementAuthMediatorContext.Provider>
  );
};

interface EngagementFieldManagerContext {
  setFieldGroups: (fieldGroups: { [key: string]: string[] }) => void;
  fieldGroups: { [key: string]: string[] };
}

const EngagementFieldManagerContext = React.createContext<
  EngagementFieldManagerContext
>(null);

interface EngagementFieldManagerContextProviderProps {
  children: any;
}

const EngagementFieldManagerContextProvider = ({
  children,
}: EngagementFieldManagerContextProviderProps) => {
  const [fieldGroups, setFieldGroups] = useState<{ [key: string]: string[] }>(
    {}
  );
  return (
    <EngagementFieldManagerContext.Provider
      value={{ setFieldGroups, fieldGroups }}
    >
      {children}
    </EngagementFieldManagerContext.Provider>
  );
};
interface EngagementLaunchContext {
  isLaunchable: boolean;
  requiredFields: string[];
  missingRequiredFields: string[];
  launchEngagement: (data: any) => Promise<Engagement>;
}

const EngagementLaunchContext = React.createContext<EngagementLaunchContext>(
  null
);

interface EngagementLaunchContextProviderProps {
  children: any;
  currentEngagementChanges: Engagement;
  feedbackContext: FeedbackContext;
  onLaunch: (data: Engagement) => Promise<Engagement>;
}

const EngagementLaunchContextProvider = ({
  children,
  currentEngagementChanges,
  feedbackContext,
  onLaunch,
}: EngagementLaunchContextProviderProps) => {
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
  const missingRequiredFields = useCallback(() => {
    return requiredFields.filter(
      field =>
        currentEngagementChanges?.[field] !== 'boolean' &&
        currentEngagementChanges?.[field] !== 'number' &&
        !currentEngagementChanges?.[field]
    );
  }, [currentEngagementChanges, requiredFields]);
  const isLaunchable = useCallback(() => {
    let result = requiredFields.every(
      o =>
        typeof currentEngagementChanges[o] === 'boolean' ||
        typeof currentEngagementChanges[o] === 'number' ||
        !!currentEngagementChanges[o]
    );
    return result;
  }, [currentEngagementChanges, requiredFields]);
  const launchEngagement = async (data: any) => {
    if (!isLaunchable()) {
      throw Error(
        'This engagement does not have the required fields to launch'
      );
    }
    feedbackContext.showLoader();
    return await onLaunch(data);
  };
  return (
    <EngagementLaunchContext.Provider
      value={{
        isLaunchable: isLaunchable(),
        requiredFields,
        missingRequiredFields: missingRequiredFields(),
        launchEngagement,
      }}
    >
      {children}
    </EngagementLaunchContext.Provider>
  );
};

interface EngagementConfigContext {
  getConfig: () => void;
  engagementFormConfig?: EngagementFormConfig;
}

interface EngagementConfigContextProviderProps {
  children: any;
  engagementService: EngagementService;
}

const EngagementConfigContext = React.createContext<EngagementConfigContext>(
  null
);

const EngagementConfigContextProvider = ({
  children,
  engagementService,
}: EngagementConfigContextProviderProps) => {
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >(undefined);
  const { validateAuthStatus } = useContext(EngagementAuthMediatorContext);
  const getConfig = useCallback(async () => {
    await validateAuthStatus();
    const data = await engagementService.getConfig();
    setEngagementFormConfig(data);
  }, [engagementService, validateAuthStatus]);
  return (
    <EngagementConfigContext.Provider
      value={{ getConfig, engagementFormConfig }}
    >
      {children}
    </EngagementConfigContext.Provider>
  );
};

interface EngagementErrorContext {
  checkErrors(e: any): Promise<void>;
  error: any;
}

const EngagementErrorContext = React.createContext<EngagementErrorContext>(
  null
);
interface EngagementErrorContextProps {
  authContext: AuthContext;
  children: any;
}
const EngagementErrorContextProvider = ({
  children,
  authContext,
}: EngagementErrorContextProps) => {
  const [error, setError] = useState<string>(null);
  const checkErrors = useCallback(
    async error => {
      Logger.instance.debug('EngagementContext:_handleErrors', error);
      if (error instanceof AuthenticationError) {
        if (!(await authContext.checkIsAuthenticated())) {
          authContext.setAuthError(error);
        }
      } else {
        throw error;
      }
    },
    [authContext]
  );
  return (
    <EngagementErrorContext.Provider value={{ error, checkErrors }}>
      {children}
    </EngagementErrorContext.Provider>
  );
};

interface CurrentEngagementContext {
  currentEngagementChanges?: Engagement;
  currentEngagement?: Engagement;
  isLoading: boolean;
  setCurrentEngagement: (Engagement: Engagement) => void;
  updateEngagementFormField: (fieldName: string, payload: any) => void;
  createEngagementPoll: (engagement: Engagement) => Promise<EngagementPoll>;
}

const CurrentEngagementContext = React.createContext<CurrentEngagementContext>(
  null
);

interface CurrentEngagementContextProviderProps {
  children: any;
  engagementFormConfig: EngagementFormConfig;
  engagementService: EngagementService;
}
const CurrentEngagementContextProvider = ({
  children,
  engagementFormConfig,
  engagementService,
}: CurrentEngagementContextProviderProps) => {
  const { checkErrors, error } = useContext(EngagementErrorContext);
  const { validateAuthStatus } = useContext(EngagementAuthMediatorContext);
  const feedbackContext = useFeedback();
  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => any
  >(
    engagementFormReducer(engagementFormConfig),
    engagementFormReducer(engagementFormConfig)()
  );

  const [currentEngagement, setCurrentEngagement] = useState<Engagement>(
    undefined
  );

  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(currentEngagement),
    });
  }, [currentEngagement, engagementFormConfig]);

  const updateEngagementFormField = useCallback(
    (fieldName: string, value: any) => {
      //     if (!changedFields.includes(fieldName)) {
      //        setChangedFields([...changedFields, fieldName]);
      //     }
      dispatch({ type: fieldName, payload: value });
    },
    []
  );
  const _createCommitMessage = (
    changedFields: string[],
    fieldGroupings: { [key: string]: string[] }
  ): string => {
    const changedGroups = changedFields
      .map(field =>
        Object.keys(fieldGroupings).find(group =>
          fieldGroupings[group].includes(field)
        )
      )
      .filter(group => !!group);
    const commitMessage = `Changed ${changedGroups.join(
      ', '
    )}\nThe following fields were changed: ${changedFields.join('\n')}`;
    return commitMessage;
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const _checkHasUpdateRef = useRef(async () => false);

  useEffect(() => {
    const checkUpdate = async () => {
      return await engagementService.checkHasUpdates(currentEngagement);
    };
    _checkHasUpdateRef.current = checkUpdate;
  }, [currentEngagement, engagementService]);

  const _refreshEngagementData = useCallback(
    async (engagement: Engagement) => {
      await validateAuthStatus();
      try {
        const refreshedEngagement = await engagementService.getEngagementByCustomerAndProjectName(
          engagement?.customer_name,
          engagement?.project_name
        );
        // TODO: Reimplement this
        // _updateEngagementInPlace(refreshedEngagement);

        setCurrentEngagement(refreshedEngagement);
      } catch (e) {
        checkErrors(e);
      }
    },
    [checkErrors, engagementService, validateAuthStatus]
  );
  const createEngagementPoll = useCallback(
    async (engagement: Engagement): Promise<EngagementPoll> => {
      await validateAuthStatus();
      return new EngagementPoll(
        new EngagementPollIntervalStrategy(
          setInterval(async () => {
            await validateAuthStatus();
            const hasUpdates = await _checkHasUpdateRef.current();
            if (hasUpdates) {
              feedbackContext.showAlert(
                'Another user edited this engagement. In order to continue, you must refresh the page. By refreshing, your unsaved changes will be overwritten."',
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
    },
    [_refreshEngagementData, feedbackContext, validateAuthStatus]
  );

  return (
    <CurrentEngagementContext.Provider
      value={{
        currentEngagementChanges: {
          ...currentEngagement,
          ...currentEngagementChanges,
        },
        setCurrentEngagement,
        currentEngagement,
        updateEngagementFormField,
        isLoading,
        createEngagementPoll,
      }}
    >
      {children}
    </CurrentEngagementContext.Provider>
  );
};

interface EngagementResourceContext {
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

const EngagementResourceContext = React.createContext<
  EngagementResourceContext
>(null);

interface EngagementResourceContextProvider {
  children: any;
  engagementService: EngagementService;
  feedbackContext: FeedbackContext;
}
const EngagementResourceContextProvider = ({
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
  const authContext = useSession();
  const getEngagements = useCallback(async () => {
    try {
      await validateAuthStatus();
      feedbackContext.showLoader();
      const engagements = await engagementService.fetchEngagements();
      setEngagements(engagements);
      feedbackContext.hideLoader();
      console.log(await authContext.checkIsAuthenticated());
      console.log('NO ERROR!!');
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
        let availableEngagements = engagements ?? [];
        let cachedEngagement = availableEngagements?.find(
          engagement =>
            engagement?.customer_name === customerName &&
            engagement?.project_name === projectName
        );
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
    [engagements, engagementService, checkErrors, feedbackContext]
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

export interface EngagementContext
  extends Omit<EngagementResourceContext, 'launchEngagement'>,
    CurrentEngagementContext,
    EngagementLaunchContext,
    EngagementConfigContext,
    EngagementErrorContext,
    EngagementFieldManagerContext {}

interface EngagementContextWrapperProps {
  engagementService: EngagementService;
  children: any;
}

export type CreateEngagementParams = Pick<
  Engagement,
  'project_name' | 'customer_name' | 'engagement_region'
>;

export const EngagementContext = createContext<EngagementContext>(null);

const { Provider } = EngagementContext;

export const EngagementMediator = ({
  children,
}: {
  children: React.ReactChild;
  engagementService: EngagementService;
}) => {
  const { getConfig, engagementFormConfig } = useContext(
    EngagementConfigContext
  );
  const {
    requiredFields,
    isLaunchable,
    missingRequiredFields,
    launchEngagement,
  } = useContext(EngagementLaunchContext);
  const {
    currentEngagementChanges,
    createEngagementPoll,
    setCurrentEngagement,
    updateEngagementFormField,
    currentEngagement,
    isLoading,
  } = useContext(CurrentEngagementContext);
  const { setFieldGroups, fieldGroups } = useContext(
    EngagementFieldManagerContext
  );
  const {
    createEngagement,
    getEngagement,
    getEngagements,
    saveEngagement,
    engagements,
  } = useContext(EngagementResourceContext);
  const { error, checkErrors } = useContext(EngagementErrorContext);

  const _setCurrentEngagement = <T extends any[]>(
    engagementGetter: (...params: T) => Promise<Engagement>
  ) => {
    return async (...params: T) => {
      const engagement = await engagementGetter(...params);
      setCurrentEngagement(engagement);
      return engagement;
    };
  };

  return (
    <Provider
      value={{
        setFieldGroups,
        createEngagementPoll,
        requiredFields,
        currentEngagement,
        missingRequiredFields,
        getConfig,
        isLaunchable,
        setCurrentEngagement,
        engagements,
        getEngagement: _setCurrentEngagement(getEngagement),
        error,
        currentEngagementChanges,
        engagementFormConfig,
        isLoading,
        updateEngagementFormField,
        getEngagements,
        createEngagement: _setCurrentEngagement(createEngagement),
        saveEngagement,
        checkErrors,
        fieldGroups,
        launchEngagement: _setCurrentEngagement(launchEngagement),
      }}
    >
      {children}
    </Provider>
  );
};

// EngagementProvider.whyDidYouRender = false;
export const EngagementProvider = ({
  children,
  engagementService,
}: EngagementContextWrapperProps) => {
  const feedbackContext = useFeedback();
  const authContext = useSession();
  return (
    <EngagementErrorContextProvider authContext={authContext}>
      <EngagementAuthMediatorContextProvider authContext={authContext}>
        <EngagementConfigContextProvider engagementService={engagementService}>
          <EngagementFieldManagerContextProvider>
            <EngagementResourceContextProvider
              feedbackContext={feedbackContext}
              engagementService={engagementService}
            >
              <EngagementResourceContext.Consumer>
                {({ launchEngagement }) => (
                  <EngagementConfigContext.Consumer>
                    {({ engagementFormConfig }) => (
                      <CurrentEngagementContextProvider
                        engagementService={engagementService}
                        engagementFormConfig={engagementFormConfig}
                      >
                        <CurrentEngagementContext.Consumer>
                          {({
                            currentEngagement,
                            currentEngagementChanges,
                          }) => (
                            <EngagementLaunchContextProvider
                              feedbackContext={feedbackContext}
                              onLaunch={launchEngagement}
                              currentEngagementChanges={{
                                ...currentEngagementChanges,
                                ...currentEngagement,
                              }}
                            >
                              <EngagementMediator
                                engagementService={engagementService}
                              >
                                {children}
                              </EngagementMediator>
                            </EngagementLaunchContextProvider>
                          )}
                        </CurrentEngagementContext.Consumer>
                      </CurrentEngagementContextProvider>
                    )}
                  </EngagementConfigContext.Consumer>
                )}
              </EngagementResourceContext.Consumer>
            </EngagementResourceContextProvider>
          </EngagementFieldManagerContextProvider>
        </EngagementConfigContextProvider>
      </EngagementAuthMediatorContextProvider>
    </EngagementErrorContextProvider>
  );
};
