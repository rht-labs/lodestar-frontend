import React, { createContext, useEffect, useRef, useContext } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useFeedback } from '../feedback_context/feedback_context';
import { useSession } from '../auth_context/auth_context';
import { EngagementService } from '../../services/engagement_service/engagement_service';
import {
  CurrentEngagementContext,
  CurrentEngagementContextProvider,
} from './subcontexts/current_engagement_context';
import {
  EngagementLaunchContext,
  EngagementLaunchContextProvider,
} from './subcontexts/engagement_launch_context';
import {
  EngagementConfigContext,
  EngagementConfigContextProvider,
} from './subcontexts/engagement_config_context';
import {
  EngagementErrorContext,
  EngagementErrorContextProvider,
} from './subcontexts/engagement_error_context';
import {
  EngagementFieldManagerContext,
  EngagementFieldManagerContextProvider,
} from './subcontexts/engagement_field_manager';
import {
  EngagementResourceContext,
  EngagementResourceContextProvider,
} from './subcontexts/engagement_resource_context';
import { EngagementAuthMediatorContextProvider } from './subcontexts/engagement_auth_mediator';

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
