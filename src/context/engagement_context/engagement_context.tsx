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
import {
  AlreadyExistsError,
  AlreadyLaunchedError,
  NotFoundError,
} from '../../services/engagement_service/engagement_service_errors';
import {
  AlertType,
  IFeedbackContext,
} from '../feedback_context/feedback_context';
import {
  AnalyticsCategory,
  IAnalyticsContext,
} from '../analytics_context/analytics_context';
import {
  EngagementPoll,
  EngagementPollIntervalStrategy,
} from '../../schemas/engagement_poll';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { CategoryService } from '../../services/category_service/category_service';
import { engagementFormReducer } from './engagement_form_reducer';
import { validateHostingEnvironment } from '../../common/validate_hosting_environment';
import { HostingEnvironment } from '../../schemas/hosting_environment';
export type FieldGroup = { [key: string]: string[] };

export interface IEngagementContext {
  currentEngagement?: Engagement;
  setCurrentEngagement: (Engagement: Engagement) => void;
  updateEngagementFormField: <T extends keyof Engagement>(
    field: T,
    value: Engagement[T],
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
  deleteEngagement: (data: Engagement) => Promise<void>;
  missingRequiredFields: string[];
  isLaunchable: boolean;
  engagementFormConfig?: EngagementFormConfig;
  launchEngagement: (data: any) => Promise<void>;
  createEngagementPoll: (engagement: Engagement) => Promise<EngagementPoll>;
}

export enum EngagementGroupings {
  hostingEnvironment = 'Hosting Environment',
  engagementSummary = 'Engagement Summary',
  pointOfContact = 'Point of Contact',
  systemStatus = 'System Status',
  users = 'Engagement Users',
  artifacts = 'Engagement Artifacts',
  activityHistory = 'Activity History',
  categories = 'Engagement Categories',
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
  feedbackContext,
  analyticsContext,
  engagementFormConfig,
}: {
  children: React.ReactChild;
  engagementService: EngagementService;
  categoryService: CategoryService;
  feedbackContext: IFeedbackContext;
  analyticsContext?: IAnalyticsContext;
  engagementFormConfig: EngagementFormConfig;
}) => {
  const [currentEngagement, _setCurrentEngagement] = useState<
    Engagement | undefined
  >();

  const [isLaunchable, setIsLaunchable] = useState<boolean>(false);
  const [changedGroups, setChangedGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => Partial<Engagement>
  >(engagementFormReducer, {});
  const clearCurrentChanges = useCallback(() => {
    dispatch({
      type: 'switch_engagement',
    });
    setChangedGroups({});
  }, [dispatch]);
  const updateEngagementFormField = useCallback(
    <T extends keyof Engagement>(
      fieldName: T,
      value: Engagement[T],
      group?: EngagementGroupings
    ) => {
      if (!!group) {
        setChangedGroups({ ...changedGroups, [group]: true });
      }
      dispatch({ type: fieldName, payload: value });
      try {
        analyticsContext.logEvent({
          category: AnalyticsCategory.engagements,
          action: 'Update Engagement',
        });
      } catch (e) {}
    },
    [analyticsContext, changedGroups]
  );
  const setCurrentEngagement = useCallback(
    (engagement: Engagement) => {
      const defaults: Partial<Engagement> = {};
      if (!engagement?.timezone) {
        const getTimeZone = () => {
          try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
          } catch (e) {
            return undefined;
          }
        };
        defaults.timezone = getTimeZone();
      }
      clearCurrentChanges();
      dispatch({ type: 'switch_engagement', payload: defaults });
      _setCurrentEngagement(engagement);
    },
    [_setCurrentEngagement, clearCurrentChanges]
  );

  const [missingRequiredFields, setMissingRequiredFields] = useState<string[]>(
    []
  );

  const _handleErrors = useCallback((e: Error) => {
    throw e;
  }, []);

  const _refreshEngagementData = useCallback(
    async (engagement: Engagement) => {
      try {
        const refreshedEngagement = await engagementService.getEngagementByCustomerAndProjectName(
          engagement?.customer_name,
          engagement?.project_name
        );
        setCurrentEngagement(refreshedEngagement);
      } catch (e) {
        _handleErrors(e);
      }
    },
    [engagementService, _handleErrors, setCurrentEngagement]
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
      return new EngagementPoll(
        new EngagementPollIntervalStrategy(
          setInterval(async () => {
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
        let availableEngagements = [];
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
          _handleErrors(e);
        } catch (e) {
          feedbackContext.showAlert(
            'There was a problem fetching this engagement',
            AlertType.error
          );
        }
      }
    },
    [feedbackContext, _handleErrors, engagementService, setCurrentEngagement]
  );

  const createEngagement = useCallback(
    async (data: CreateEngagementParams) => {
      feedbackContext.showLoader();
      try {
        const engagement = await engagementService.createEngagement(data);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'Your engagement has been successfully created',
          AlertType.success
        );
        setCurrentEngagement(engagement);
        return engagement;
      } catch (e) {
        feedbackContext.hideLoader();
        let errorMessage: string;
        if (e instanceof AlreadyExistsError) {
          errorMessage =
            'This client already has a project with that name. Please choose a different project name.';
        } else {
          try {
            _handleErrors(e);
          } catch (e) {
            errorMessage =
              'There was an issue with creating your engagement. Please follow up with an administrator if this continues.';
          }
        }

        feedbackContext.showAlert(errorMessage, AlertType.error);
        _handleErrors(e);
      }
    },
    [engagementService, feedbackContext, setCurrentEngagement, _handleErrors]
  );
  const _validateHostingEnvironment = useCallback(
    async (
      hostingEnvironment: Partial<HostingEnvironment>
    ): Promise<boolean> => {
      return validateHostingEnvironment(
        hostingEnvironment,
        engagementService,
        hostingEnvironment?.ocp_sub_domain
      );
    },
    [engagementService]
  );
  const _checkLaunchReady = useCallback(async () => {
    if (!currentEngagement) {
      return false;
    }
    let hasAllRequiredFields = requiredFields.every(
      o =>
        typeof currentEngagement[o] === 'boolean' ||
        typeof currentEngagement[o] === 'number' ||
        !!currentEngagement[o]
    );
    if (!hasAllRequiredFields) {
      return false;
    } else if (
      !Engagement.areDatesValid(
        currentEngagement?.start_date,
        currentEngagement?.end_date,
        currentEngagement?.archive_date
      )
    ) {
      return false;
    } else {
      return (
        await Promise.all(
          currentEngagement?.hosting_environments?.map(e =>
            _validateHostingEnvironment(e)
          )
        )
      ).every(r => r);
    }
  }, [currentEngagement, _validateHostingEnvironment]);
  useEffect(() => {
    _checkLaunchReady().then(isLaunchable => setIsLaunchable(isLaunchable));
  }, [currentEngagement, _checkLaunchReady]);

  const getMissingRequiredFields = useCallback(async () => {
    const heValidation = await Promise.all(
      (currentEngagement?.hosting_environments ?? []).map?.(
        _validateHostingEnvironment
      )
    );
    const fields = (requiredFields ?? [])
      .filter(
        field =>
          currentEngagement?.[field] !== 'boolean' &&
          currentEngagement?.[field] !== 'number' &&
          !currentEngagement?.[field]
      )
      .concat(heValidation.every(a => a) ? [] : ['hosting_environments']);
    return fields;
  }, [currentEngagement, _validateHostingEnvironment]);

  useEffect(() => {
    getMissingRequiredFields().then(fields => {
      setMissingRequiredFields(fields);
    });
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
        if (engagementChanges?.engagement_users?.some?.(user => user?.reset)) {
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
      try {
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
        setCurrentEngagement(returnedEngagement);
      } catch (e) {
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
            _handleErrors(e);
            errorMessage =
              'Your changes could not be saved. Another user has modified this data. Please refresh your data in order to make changes.';
          }
        }
        feedbackContext.showAlert(errorMessage, AlertType.error);
      }
    },
    [
      feedbackContext,
      currentEngagementChanges,
      engagementService,
      _handleErrors,
      changedGroups,
      setCurrentEngagement,
    ]
  );

  const launchEngagement = useCallback(
    async (data: any) => {
      if (!(await _checkLaunchReady())) {
        throw Error(
          'This engagement does not have the required fields to launch'
        );
      }
      feedbackContext.showLoader();
      try {
        const returnedEngagement = await engagementService.launchEngagement(
          data
        );
        setCurrentEngagement(returnedEngagement);
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'You have successfully launched your engagement!',
          AlertType.success
        );
      } catch (e) {
        feedbackContext.hideLoader();
        feedbackContext.showAlert(
          'We were unable to launch your engagement. Please follow up with an administrator if this continues.',
          AlertType.error,
          false
        );
        _handleErrors(e);
      }
    },
    [
      _checkLaunchReady,
      engagementService,
      feedbackContext,
      _handleErrors,
      setCurrentEngagement,
    ]
  );

  const deleteEngagement = useCallback(
    async (engagement: Engagement) => {
      try {
        await engagementService.deleteEngagement(engagement);
        if (currentEngagement.uuid === engagement.uuid) {
          setCurrentEngagement(undefined);
        }
        feedbackContext.showAlert(
          'Engagement is deleted successfully',
          AlertType.success
        );
        feedbackContext.hideLoader();
      } catch (e) {
        feedbackContext.hideLoader();
        let errorMessage: string;
        if (e instanceof AlreadyLaunchedError) {
          errorMessage =
            'This engagement is already launched and has not been removed';
        }
        if (e instanceof NotFoundError) {
          errorMessage = 'Engagement is not found';
        } else {
          try {
            _handleErrors(e);
          } catch (e) {
            errorMessage =
              'There was an issue with deleting selected engagement. Please follow up with an administrator if this continues.';
          }
        }

        feedbackContext.showAlert(errorMessage, AlertType.error);
        _handleErrors(e);
      }
    },
    [
      engagementService,
      setCurrentEngagement,
      currentEngagement,
      feedbackContext,
      _handleErrors,
    ]
  );

  return (
    <Provider
      value={{
        createEngagementPoll,
        engagementFormConfig,
        requiredFields,
        /**
         * ? REFACTOR: This just becomes engagement?
         */
        currentEngagement,
        missingRequiredFields,
        isLaunchable,
        /**
         * ? REFACTOR: What is the relationship between set current engagement and this collection?
         */
        setCurrentEngagement,
        /**
         * ? REFACTOR: This is no longer part of the public API?
         */
        getEngagement,
        createEngagement,
        deleteEngagement,
        saveEngagement,
        launchEngagement,
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

export const useEngagementDetails = () => {
  const engagementContext = useContext(EngagementContext);
  return {
    startDate: engagementContext.currentEngagement.start_date,
    endDate: engagementContext.currentEngagement.end_date,
    archiveDate: engagementContext.currentEngagement.archive_date,
  };
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
  const [artifacts = [], setArtifacts] = useEngagementFormField(
    'artifacts',
    EngagementGroupings.artifacts
  );
  const addArtifact = (artifact: Artifact) => {
    const artifactsCopy = [...artifacts];
    const index = artifactsCopy.findIndex(a => a.id === artifact.id);
    if (index > -1) {
      artifactsCopy.splice(index, 1, artifact);
    } else {
      artifactsCopy.push(artifact);
    }
    setArtifacts(artifactsCopy);
    return artifactsCopy;
  };
  const removeArtifact = (artifact: Artifact) => {
    const artifactsClone = [...artifacts];
    const removeIndex = artifacts.findIndex(a => a.id === artifact.id);
    artifactsClone.splice(removeIndex, 1);
    setArtifacts(artifactsClone);
    return artifactsClone;
  };

  const updateArtifact = (artifact: Artifact) => {
    const artifactsClone = [...artifacts];
    const removeIndex = artifacts.findIndex(a => a.id === artifact.id);
    artifactsClone.splice(removeIndex, 1, artifact);
    setArtifacts(artifactsClone);
    return artifactsClone;
  };
  return {
    artifacts: artifacts ?? [],
    addArtifact,
    removeArtifact,
    updateArtifact,
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

export const useHostingEnvironmentManager = () => {
  const [hostingEnvironments, setHostingEnvironments] = useEngagementFormField(
    'hosting_environments',
    EngagementGroupings.hostingEnvironment
  );

  const addHostingEnvironment = (
    hostingEnvironment: Partial<HostingEnvironment>
  ) => {
    const newHostingEnvironments = [...hostingEnvironments, hostingEnvironment];
    setHostingEnvironments(newHostingEnvironments as HostingEnvironment[]);
    return newHostingEnvironments;
  };

  const updateHostingEnvironment = (hostingEnvironment: HostingEnvironment) => {
    const updateIndex = hostingEnvironments.findIndex(
      he => he.id === hostingEnvironment.id
    );
    const newHostingEnvironments = [...hostingEnvironments];
    newHostingEnvironments.splice(updateIndex, 1, hostingEnvironment);
    setHostingEnvironments(newHostingEnvironments);
    return newHostingEnvironments;
  };

  const deleteHostingEnvironment = (hostingEnvironment: HostingEnvironment) => {
    const newHostingEnvironments = [...hostingEnvironments];
    hostingEnvironments.splice(
      hostingEnvironments.findIndex(p => p.id === hostingEnvironment.id),
      1
    );
    setHostingEnvironments(newHostingEnvironments);
    return newHostingEnvironments;
  };

  return {
    addHostingEnvironment,
    deleteHostingEnvironment,
    updateHostingEnvironment,
    hostingEnvironments,
  };
};
