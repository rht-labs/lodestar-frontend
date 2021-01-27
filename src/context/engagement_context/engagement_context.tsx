import React, {
  createContext,
  useEffect,
  useRef,
  useReducer,
  useContext,
} from 'react';
import { Artifact, Engagement, EngagementUser } from '../../schemas/engagement';
import { useState, useCallback } from 'react';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError } from '../../services/engagement_service/engagement_service_errors';
import { Logger } from '../../utilities/logger';
import {
  AlertType,
  IFeedbackContext,
} from '../feedback_context/feedback_context';
import {
  AnalyticsCategory,
  IAnalyticsContext,
} from '../analytics_context/analytics_context';
import { AuthenticationError } from '../../services/auth_service/auth_errors';
import {
  EngagementPoll,
  EngagementPollIntervalStrategy,
} from '../../schemas/engagement_poll';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { EngagementCategory } from '../../schemas/engagement_category';
import { CategoryService } from '../../services/category_service/category_service';
import { engagementFormReducer } from './engagement_form_reducer';
import { IAuthContext } from '../auth_context/auth_context';
import { validateHostingEnvironment } from '../../common/validate_hosting_environment';
export type FieldGroup = { [key: string]: string[] };

export interface IEngagementContext {
  getEngagements: () => Promise<Engagement[]>;
  currentEngagement?: Engagement;
  setCurrentEngagement: (Engagement: Engagement) => void;
  engagements?: Engagement[];
  updateEngagementFormField: (
    field: keyof Engagement,
    value: any,
    group?: EngagementGroupings
  ) => void;
  currentChanges: Engagement;
  clearCurrentChanges: () => void;
  requiredFields: string[];
  getEngagement: (
    customerName: string,
    projectName: string
  ) => Promise<Engagement>;
  createEngagement: (data: any) => Promise<Engagement>;
  saveEngagement: (data: Engagement, commitMessage?: string) => Promise<void>;
  missingRequiredFields: string[];
  isLaunchable: boolean;
  engagementFormConfig?: EngagementFormConfig;
  launchEngagement: (data: any) => Promise<void>;
  createEngagementPoll: (engagement: Engagement) => Promise<EngagementPoll>;
  fetchCategories: () => void;
  categories?: EngagementCategory[];
}

export enum EngagementGroupings {
  hostingEnvironment = 'Hosting Environment',
  engagementSummary = 'Engagement Summary',
  pointOfContact = 'Point of Contact',
  systemStatus = 'System Status',
  users = 'Engagement Users',
  artifacts = 'Engagement Artifacts',
  activityHistory = 'Activity History',
}

export type CreateEngagementParams = Pick<
  Engagement,
  'project_name' | 'customer_name' | 'engagement_region'
>;

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
  'project_name',
];
export const EngagementContext = createContext<IEngagementContext>(
  ({} as unknown) as IEngagementContext
);

const { Provider } = EngagementContext;

export const EngagementProvider = ({
  children,
  engagementService,
  categoryService,
  feedbackContext,
  authContext,
  analyticsContext,
}: {
  children: React.ReactChild;
  authContext: IAuthContext;
  engagementService: EngagementService;
  categoryService: CategoryService;
  feedbackContext: IFeedbackContext;
  analyticsContext?: IAnalyticsContext;
}) => {
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [categories, setCategories] = useState<EngagementCategory[]>(undefined);
  const [currentEngagement, _setCurrentEngagement] = useState<
    Engagement | undefined
  >();
  const setCurrentEngagement = useCallback(
    (engagement: Engagement) => {
      dispatch({});
      _setCurrentEngagement(engagement);
    },
    [_setCurrentEngagement]
  );
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >();
  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => Partial<Engagement>
  >(
    engagementFormReducer(engagementFormConfig),
    engagementFormReducer(engagementFormConfig)()
  );

  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>(
    []
  );

  const [changedGroups, setChangedGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const clearCurrentChanges = useCallback(() => {
    dispatch({
      type: 'switch_engagement',
    });
    setChangedGroups({});
  }, [dispatch]);
  useEffect(() => {
    clearCurrentChanges();
  }, [currentEngagement, clearCurrentChanges]);
  const _handleErrors = useCallback(
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

  useEffect(() => {
    _validateAuthStatusRef.current = async () => {
      if (!(await authContext.checkIsAuthenticated())) {
        throw new AuthenticationError();
      }
    };
  }, [authContext]);

  const _validateAuthStatusRef = useRef(async () => {});

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
      await _validateAuthStatusRef.current();
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
      await _handleErrors(e);
    }
  }, [engagementService, feedbackContext, _handleErrors]);

  const _refreshEngagementData = useCallback(
    async (engagement: Engagement) => {
      await _validateAuthStatusRef.current();
      try {
        const refreshedEngagement = await engagementService.getEngagementByCustomerAndProjectName(
          engagement?.customer_name,
          engagement?.project_name
        );
        _updateEngagementInPlace(refreshedEngagement);
        setCurrentEngagement(refreshedEngagement);
      } catch (e) {
        _handleErrors(e);
      }
    },
    [
      _updateEngagementInPlace,
      engagementService,
      _handleErrors,
      setCurrentEngagement,
    ]
  );

  const _checkHasUpdateRef = useRef(async () => false);

  useEffect(() => {
    const checkUpdate = async () => {
      return await engagementService.checkHasUpdates(currentEngagement);
    };
    _checkHasUpdateRef.current = checkUpdate;
  }, [currentEngagement, engagementService]);

  const createEngagementPoll = useCallback(
    async (engagement: Engagement): Promise<EngagementPoll> => {
      await _validateAuthStatusRef.current();
      return new EngagementPoll(
        new EngagementPollIntervalStrategy(
          setInterval(async () => {
            await _validateAuthStatusRef.current();
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
    [_refreshEngagementData, feedbackContext]
  );

  const getEngagement = useCallback(
    async (customerName: string, projectName: string) => {
      try {
        let availableEngagements = engagements ?? [];
        let cachedEngagement = availableEngagements?.find(
          engagement =>
            engagement?.customer_name === customerName &&
            engagement?.project_name === projectName
        );
        if (cachedEngagement !== null) {
          setCurrentEngagement(cachedEngagement);
        }
        let fetchedEngagement = await engagementService.getEngagementByCustomerAndProjectName(
          customerName,
          projectName
        );
        setCurrentEngagement(fetchedEngagement);
        return fetchedEngagement;
      } catch (e) {
        try {
          await _handleErrors(e);
        } catch (e) {
          feedbackContext.showAlert(
            'There was a problem fetching this engagement',
            AlertType.error
          );
        }
      }
    },
    [
      engagements,
      feedbackContext,
      _handleErrors,
      engagementService,
      setCurrentEngagement,
    ]
  );

  const _addNewEngagement = useCallback(
    async (newEngagement: Engagement) => {
      try {
        const newEngagementList = [newEngagement, ...(engagements ?? [])];
        setEngagements(newEngagementList);
      } catch (e) {
        await _handleErrors(e);
        Logger.instance.error(e);
      }
    },
    [engagements, _handleErrors]
  );

  const createEngagement = useCallback(
    async (data: CreateEngagementParams) => {
      feedbackContext.showLoader();
      try {
        await _validateAuthStatusRef.current();
        const engagement = await engagementService.createEngagement(data);
        _addNewEngagement(engagement);
        setEngagements([...(engagements ?? []), engagement]);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'Your engagement has been successfully created',
          AlertType.success
        );
        setCurrentEngagement(engagement);
        return engagement;
      } catch (e) {
        feedbackContext.hideLoader();
        let errorMessage;
        if (e instanceof AlreadyExistsError) {
          errorMessage =
            'This client already has a project with that name. Please choose a different project name.';
        } else {
          try {
            await _handleErrors(e);
          } catch (e) {
            errorMessage =
              'There was an issue with creating your engagement. Please follow up with an administrator if this continues.';
          }
        }

        feedbackContext.showAlert(errorMessage, AlertType.error);
        await _handleErrors(e);
      }
    },
    [
      engagementService,
      _addNewEngagement,
      feedbackContext,
      engagements,
      setCurrentEngagement,
      _handleErrors,
    ]
  );
  const _validateHostingEnvironment = useCallback(
    async (hostingEnvironment): Promise<boolean> => {
      return validateHostingEnvironment(hostingEnvironment, engagementService);
    },
    [engagementService]
  );

  const _checkLaunchReady = useCallback(() => {
    if (!currentEngagement) {
      return false;
    }
    let result = requiredFields.every(
      o =>
        typeof currentEngagement[o] === 'boolean' ||
        typeof currentEngagement[o] === 'number' ||
        !!currentEngagement[o]
    );
    if (!result) {
      return result;
    } else {
      return currentEngagement?.hosting_environments?.every(e =>
        _validateHostingEnvironment(e)
      );
    }
  }, [currentEngagement, _validateHostingEnvironment]);

  const getMissingRequiredFields = useCallback(async () => {
    const fields =
      requiredFields ??
      []
        .filter(
          field =>
            currentEngagement?.[field] !== 'boolean' &&
            currentEngagement?.[field] !== 'number' &&
            !currentEngagement?.[field]
        )
        .concat(
          !!(
            await currentEngagement?.hosting_environments?.map?.(
              _validateHostingEnvironment
            )
          ).every(a => a)
            ? []
            : ['hosting_environments']
        );
    return fields;
  }, [currentEngagement, _validateHostingEnvironment]);

  useEffect(() => {
    getMissingRequiredFields().then(setMissingRequiredFields);
  }, [getMissingRequiredFields, currentEngagement]);

  const saveEngagement = useCallback(
    async (data: Engagement) => {
      const _createCommitMessage = (
        changedGroups: string[],
        engagementChanges: Partial<Engagement>
      ): string => {
        const changedFields = Object.keys(currentEngagementChanges).filter(
          k => !!currentEngagementChanges[k]
        );
        let commitMessage = `Changed ${changedGroups.join(
          ', '
        )}\nThe following fields were changed:\n${changedFields.join('\n')}`;
        if (engagementChanges?.engagement_users?.some?.(user => user.reset)) {
          commitMessage += '\nThe following users have been reset:';
          engagementChanges.engagement_users
            .filter(u => u.reset)
            .forEach(
              user =>
                (commitMessage += `\n${user.first_name} ${user.last_name}`)
            );
        }
        return commitMessage;
      };
      const commitMessage = _createCommitMessage(
        Object.keys(changedGroups).filter(k => !!changedGroups[k]),
        currentEngagementChanges
      );
      feedbackContext.showLoader();
      const oldEngagement = _updateEngagementInPlace(data);
      try {
        await _validateAuthStatusRef.current();
        const returnedEngagement = await engagementService.saveEngagement(
          data,
          commitMessage
        );
        feedbackContext.showAlert(
          'Your updates have been successfully saved.',
          AlertType.success
        );
        feedbackContext.hideLoader();
        setChangedGroups({});
        _updateEngagementInPlace(returnedEngagement);
        setCurrentEngagement(returnedEngagement);
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        let errorMessage =
          'There was an issue with saving your changes. Please follow up with an administrator if this continues.';
        if (e instanceof AlreadyExistsError) {
          // If there is no mongo id associated with the engagement, then it is being committed to the backend for the first time. It is a net new engagement.
          if (!!data.mongo_id) {
            errorMessage =
              'The path that you input is already taken.  Please update and try saving again.';

            // Otherwise, we are saving an existing engagement.
          } else {
            await _handleErrors(e);
            errorMessage =
              'Your changes could not be saved. Another user has modified this data. Please refresh your data in order to make changes.';
          }
        }
        feedbackContext.showAlert(errorMessage, AlertType.error);
      }
    },
    [
      feedbackContext,
      _updateEngagementInPlace,
      currentEngagementChanges,
      engagementService,
      _handleErrors,
      changedGroups,
      setCurrentEngagement,
    ]
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
        await _validateAuthStatusRef.current();
        const returnedEngagement = await engagementService.launchEngagement(
          data
        );
        _updateEngagementInPlace(returnedEngagement);
        setCurrentEngagement(returnedEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'You have successfully launched your engagement!',
          AlertType.success
        );
      } catch (e) {
        _updateEngagementInPlace(oldEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'We were unable to launch your engagement. Please follow up with an administrator if this continues.',
          AlertType.error,
          false
        );
        await _handleErrors(e);
      }
    },
    [
      _updateEngagementInPlace,
      _checkLaunchReady,
      engagementService,
      feedbackContext,
      _handleErrors,
      setCurrentEngagement,
    ]
  );
  const fetchCategories = useCallback(async () => {
    try {
      // feedbackContext.showLoader();
      const categories = await categoryService.fetchCategories();
      setCategories(categories);
      // feedbackContext.hideLoader();
    } catch (e) {
      try {
        _handleErrors(e);
      } catch (e) {
        throw e;
      }
    }
  }, [categoryService, _handleErrors]);

  const _getEngagementFormConfig = () => {
    if (!engagementFormConfig) {
      engagementService
        ?.getConfig?.()
        ?.then?.(config => setEngagementFormConfig(config));
    }
    return engagementFormConfig;
  };

  const updateEngagementFormField = (
    fieldName: keyof Engagement,
    value: any,
    group?: EngagementGroupings
  ) => {
    setChangedGroups({ ...changedGroups, [group]: true });
    dispatch({ type: fieldName, payload: value });
    try {
      analyticsContext.logEvent({
        category: AnalyticsCategory.engagements,
        action: 'Update Engagement',
      });
    } catch (e) {}
  };
  return (
    <Provider
      value={{
        createEngagementPoll,
        engagementFormConfig: _getEngagementFormConfig(),
        requiredFields,
        currentEngagement,
        missingRequiredFields,
        isLaunchable: _checkLaunchReady(),
        setCurrentEngagement,
        engagements,
        getEngagement,
        getEngagements: fetchEngagements,
        createEngagement,
        saveEngagement,
        launchEngagement,
        fetchCategories,
        categories,
        currentChanges: {
          ...currentEngagement,
          ...currentEngagementChanges,
        },
        clearCurrentChanges,
        updateEngagementFormField,
      }}
    >
      {children}
    </Provider>
  );
};

export const useEngagementFormConfig = () => {
  const engagementContext = useContext(EngagementContext);
  return {
    engagementFormConfig: engagementContext.engagementFormConfig,
  };
};

export const useEngagementDetails = () => {
  const engagementContext = useContext(EngagementContext);
  return {
    startDate: engagementContext.currentEngagement.start_date,
    endDate: engagementContext.currentEngagement.end_date,
    archiveDate: engagementContext.currentEngagement.archive_date,
  };
};

export const useEngagement = (customerName: string, projectName: string) => {
  const engagementContext = useContext(EngagementContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    engagementContext
      .getEngagement(customerName, projectName)
      .then(engagement => engagementContext.setCurrentEngagement(engagement))
      .catch(error => setError(error))
      .finally(() => setIsLoading(false));
  }, [engagementContext, customerName, projectName]);
  return [engagementContext.currentEngagement, error, isLoading];
};

export const useEngagementFormField = <K extends keyof Engagement>(
  formField: K,
  group?: EngagementGroupings
): [Engagement[K], (value: Engagement[K]) => void] => {
  const engagementContext = useContext(EngagementContext);

  const value = engagementContext?.currentChanges?.[formField];

  const updateValue = (value: Engagement[K]) => {
    engagementContext.updateEngagementFormField(formField, value, group);
  };

  return [value, updateValue];
};

export const useEngagementArtifacts = () => {
  const { currentEngagement, updateEngagementFormField } = useContext(
    EngagementContext
  );
  const { artifacts } = currentEngagement ?? {};
  const addArtifact = (artifact: Artifact) => {
    updateEngagementFormField('artifacts', [...artifacts, artifact]);
    return [...artifacts, artifact];
  };
  const removeArtifact = (artifact: Artifact) => {
    const artifactsClone = [...artifacts];
    const removeIndex = artifacts.findIndex(a => a.id === artifact.id);
    artifactsClone.splice(removeIndex, 1);
    updateEngagementFormField('artifacts', artifactsClone);
    return artifactsClone;
  };
  return {
    artifacts: artifacts ?? [],
    addArtifact,
    removeArtifact,
  };
};

export const useEngagementUserManager = () => {
  const {
    currentChanges = {} as Partial<Engagement>,
    updateEngagementFormField,
  } = useContext(EngagementContext);
  const { engagement_users: users = [] } = currentChanges;

  const addUser = (user: EngagementUser) => {
    const newUsers = [...users, user];
    updateEngagementFormField(
      'engagement_users',
      newUsers,
      EngagementGroupings.users
    );
    return newUsers;
  };

  const updateUser = (user: EngagementUser) => {
    const updateIndex = users.findIndex(u => u.uuid === user.uuid);
    const newUsers = [...users];
    newUsers.splice(updateIndex, 1, user);
    updateEngagementFormField(
      'engagement_users',
      newUsers,
      EngagementGroupings.users
    );
    return newUsers;
  };

  return {
    addUser,
    updateUser,
    users,
  };
};

export const useEngagementUser = (user: EngagementUser) => {
  function validateEmail(email: string) {
    // eslint-disable-next-line
    let regexEmail = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
    return regexEmail.test(email);
  }

  function validateString(name: string) {
    let regexString = /^[\w'\-,.]*[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]+$/;
    return regexString.test(name);
  }

  function validateRole(role: string) {
    return !(role === undefined || role === '');
  }
  const [currentUserEdits, _setUser] = useState(user);
  const setUser = (user: Partial<EngagementUser>) => {
    _setUser({ ...currentUserEdits, ...user });
  };
  const isValid =
    validateEmail(user.email) &&
    validateString(user.first_name) &&
    validateString(user.last_name) &&
    validateRole(user.role);
  return [currentUserEdits, isValid, setUser];
};
