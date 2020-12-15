import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { Engagement } from '../../schemas/engagement';
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
import { HostingEnvironment } from '../../schemas/hosting_environment';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import { IAuthContext } from '../auth_context/auth_context';
export type FieldGroup = { [key: string]: string[] };

export interface IEngagementContext {
  getEngagements: () => Promise<Engagement[]>;
  currentEngagement?: Engagement;
  setCurrentEngagement: (Engagement: Engagement) => void;
  engagements?: Engagement[];
  updateEngagementFormField: (field: string, value: any) => void;
  fieldGroups: FieldGroup;
  currentChanges: Partial<Engagement>;
  setFieldGroups: (groups: FieldGroup) => void;
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
  error: any;
  isLoading: boolean;
  launchEngagement: (data: any) => Promise<void>;
  createEngagementPoll: (engagement: Engagement) => Promise<EngagementPoll>;
  fetchCategories: () => void;
  saveChanges: () => void;
  categories?: EngagementCategory[];
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
export const EngagementContext = createContext<IEngagementContext>(null);

const { Provider } = EngagementContext;

export const EngagementProvider = ({
  children,
  engagementService,
  categoryService,
  feedbackContext,
  analyticsContext,
  authContext,
}: {
  children: React.ReactChild;
  authContext: IAuthContext;
  engagementService: EngagementService;
  categoryService: CategoryService;
  feedbackContext: IFeedbackContext;
  analyticsContext?: IAnalyticsContext;
}) => {
  const [error] = useState<any>();
  const [isLoading] = useState<boolean>(false);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [categories, setCategories] = useState<EngagementCategory[]>(undefined);
  const [currentEngagement, setCurrentEngagement] = useState<
    Engagement | undefined
  >();
  const [engagementFormConfig, setEngagementFormConfig] = useState<
    EngagementFormConfig
  >();

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
    [_updateEngagementInPlace, engagementService, _handleErrors]
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
    [engagements, feedbackContext, _handleErrors, engagementService]
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
      _handleErrors,
    ]
  );
  const notNullOrUndefined = x => x !== null && x !== undefined && x !== '';
  const _validateHostingEnvironment = useCallback(
    ({
      ocp_cloud_provider_name,
      ocp_cloud_provider_region,
      ocp_cluster_size,
      ocp_persistent_storage_size,
      ocp_sub_domain,
      ocp_version,
    }: HostingEnvironment): boolean => {
      return [
        ocp_cloud_provider_name,
        ocp_cloud_provider_region,
        ocp_cluster_size,
        ocp_persistent_storage_size,
        ocp_sub_domain,
        ocp_version,
      ].every(notNullOrUndefined);
    },
    []
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

  const missingRequiredFields = useCallback(() => {
    return requiredFields
      .filter(
        field =>
          currentEngagement?.[field] !== 'boolean' &&
          currentEngagement?.[field] !== 'number' &&
          !currentEngagement?.[field]
      )
      .concat(
        !!currentEngagement?.hosting_environments?.every?.(
          _validateHostingEnvironment
        )
          ? []
          : ['hosting_environments']
      );
  }, [currentEngagement, _validateHostingEnvironment]);

  const saveEngagement = useCallback(
    async (data: Engagement, commitMessage?: string) => {
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
      engagementService,
      _handleErrors,
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
    ]
  );
  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(currentEngagement),
    });
  }, [currentEngagement, engagementFormConfig]);
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

  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => any
  >(
    engagementFormReducer(engagementFormConfig),
    engagementFormReducer(engagementFormConfig)()
  );
  const clearCurrentChanges = useCallback(
    () =>
      dispatch({
        type: 'switch_engagement',
        payload: getInitialState(currentEngagement),
      }),
    [dispatch, currentEngagement]
  );

  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [fieldGroups, setFieldGroups] = useState<FieldGroup>();

  const updateEngagementFormField = (fieldName: string, value: any) => {
    if (!changedFields.includes(fieldName)) {
      setChangedFields([...changedFields, fieldName]);
    }
    dispatch({ type: fieldName, payload: value });

    try {
      analyticsContext.logEvent({
        category: AnalyticsCategory.engagements,
        action: 'Update Engagement',
      });
    } catch (e) {}
  };
  const saveChanges = () => {
    const _createCommitMessage = (
      changedFields: string[],
      fieldGroupings: { [key: string]: string[] } = {}
    ): string => {
      const changedGroups = Array.from(
        new Set(
          changedFields
            .map(field =>
              Object.keys(fieldGroupings).find(group =>
                fieldGroupings[group].includes(field)
              )
            )
            .filter(group => !!group)
        )
      );
      const commitMessage = `Changed ${changedGroups.join(
        ', '
      )}\nThe following fields were changed:\n${changedFields.join('\n')}`;
      return commitMessage;
    };
    const commitMessage = _createCommitMessage(changedFields, fieldGroups);
    saveEngagement(
      { ...currentEngagement, ...currentEngagementChanges },
      commitMessage
    );
    setChangedFields([]);
    clearCurrentChanges();
  };
  return (
    <Provider
      value={{
        createEngagementPoll,
        engagementFormConfig: _getEngagementFormConfig(),
        requiredFields,
        currentEngagement,
        missingRequiredFields: missingRequiredFields(),
        isLaunchable: _checkLaunchReady(),
        setCurrentEngagement,
        engagements,
        getEngagement,
        error,
        isLoading,
        getEngagements: fetchEngagements,
        createEngagement,
        saveEngagement,
        launchEngagement,
        fetchCategories,
        categories,
        fieldGroups,
        currentChanges: {
          ...currentEngagement,
          ...currentEngagementChanges,
        },
        clearCurrentChanges,
        updateEngagementFormField,
        saveChanges,
        setFieldGroups,
      }}
    >
      {children}
    </Provider>
  );
};

// EngagementProvider.whyDidYouRender = false;
