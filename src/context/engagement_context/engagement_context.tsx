import React, { createContext, useEffect, useRef } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useState, useCallback, useReducer } from 'react';
import {
  engagementFormReducer,
  getInitialState,
} from './engagement_form_reducer';
import { useFeedback, AlertType } from '../feedback_context/feedback_context';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError } from '../../services/engagement_service/engagement_service_errors';
import { Logger } from '../../utilities/logger';
import { AuthenticationError } from '../../services/auth_service/auth_errors';
import { useSession } from '../auth_context/auth_context';
import {
  EngagementPoll,
  EngagementPollIntervalStrategy,
} from '../../schemas/engagement_poll';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import { EngagementCategory } from "../../schemas/engagement_category";
import { CategoryService } from "../../services/category_service/category_service";

export interface EngagementContext {
  setFieldGroups: (fieldGroups: { [key: string]: string[] }) => void;
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
  engagementFormConfig?: EngagementFormConfig;
  error: any;
  isLoading: boolean;
  launchEngagement: (data: any) => Promise<void>;
  createEngagementPoll: (engagement: Engagement) => Promise<EngagementPoll>;
  fetchCategories: () => void;
  categories?: EngagementCategory[]
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
  engagementService,
  categoryService,
}: {
  children: React.ReactChild;
  engagementService: EngagementService;
  categoryService: CategoryService;
}) => {
  const feedbackContext = useFeedback();
  const [engagementFormConfig, setengagementFormConfig] = useState<
    EngagementFormConfig
  >();

  const [error] = useState<any>();
  const [isLoading] = useState<boolean>(false);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [fieldGroups, setFieldGroups] = useState<{ [key: string]: string[] }>();
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [categories, setCategories] = useState<EngagementCategory[]>([]);
  const [currentEngagement, setCurrentEngagement] = useState<
    Engagement | undefined
  >();
  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => any
  >(
    engagementFormReducer(engagementFormConfig),
    engagementFormReducer(engagementFormConfig)()
  );

  const authContext = useSession();

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

  const getConfig = useCallback(async () => {
    await _validateAuthStatusRef.current();
    const data = await engagementService.getConfig();
    setengagementFormConfig(data);
  }, [engagementService]);

  useEffect(() => {
    dispatch({
      type: 'switch_engagement',
      payload: getInitialState(currentEngagement),
    });
  }, [currentEngagement, engagementFormConfig]);

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
      const commitMessage = _createCommitMessage(changedFields, fieldGroups);
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
          'There was an issue with saving your changes. Please followup with an administrator if this continues.';
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
      changedFields,
      fieldGroups,
      _updateEngagementInPlace,
      engagementService,
      _handleErrors,
    ]
  );

  const updateEngagementFormField = useCallback(
    (fieldName: string, value: any) => {
      if (!changedFields.includes(fieldName)) {
        setChangedFields([...changedFields, fieldName]);
      }
      dispatch({ type: fieldName, payload: value });
    },
    [changedFields]
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

  const fetchCategories = useCallback(async () => {
    try {
      // feedbackContext.showLoader();
      const categories = await categoryService.fetchCategories();
      setCategories(categories);
      // feedbackContext.hideLoader();
      console.log('*******');
      console.log(categories);
    } catch (e) {
      try {
        _handleErrors(e);
      } catch (e) {
        throw e;
      }
    }
  }, [categoryService, feedbackContext, _handleErrors]);

  return (
    <Provider
      value={{
        setFieldGroups,
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
        engagementFormConfig,
        isLoading,
        updateEngagementFormField,
        getEngagements: fetchEngagements,
        createEngagement,
        saveEngagement,
        launchEngagement,
        fetchCategories,
        categories
      }}
    >
      {children}
    </Provider>
  );
};

// EngagementProvider.whyDidYouRender = false;
