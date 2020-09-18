import React, {
  useState,
  useCallback,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from 'react';
import { Engagement } from '../../../schemas/engagement';
import {
  EngagementPoll,
  EngagementPollIntervalStrategy,
} from '../../../schemas/engagement_poll';
import { EngagementAuthMediatorContext } from './engagement_auth_mediator';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { EngagementService } from '../../../services/engagement_service/engagement_service';
import { EngagementErrorContext } from './engagement_error_context';
import {
  useFeedback,
  AlertType,
} from '../../feedback_context/feedback_context';
import {
  engagementFormReducer,
  getInitialState,
} from '../engagement_form_reducer';
export interface CurrentEngagementContext {
  currentEngagementChanges?: Engagement;
  currentEngagement?: Engagement;
  isLoading: boolean;
  setCurrentEngagement: (Engagement: Engagement) => void;
  updateEngagementFormField: (fieldName: string, payload: any) => void;
  createEngagementPoll: (engagement: Engagement) => Promise<EngagementPoll>;
}

export const CurrentEngagementContext = React.createContext<
  CurrentEngagementContext
>(null);

interface CurrentEngagementContextProviderProps {
  children: any;
  engagementFormConfig: EngagementFormConfig;
  engagementService: EngagementService;
}
export const CurrentEngagementContextProvider = ({
  children,
  engagementFormConfig,
  engagementService,
}: CurrentEngagementContextProviderProps) => {
  const { checkErrors } = useContext(EngagementErrorContext);
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
  const [isLoading] = useState<boolean>(false);
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
