import React, { useEffect, Profiler } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Logger } from '../../utilities/logger';
import { useParams } from 'react-router';
import { getValidatorsFromengagementFormConfig } from '../../common/config_validator_adapter';
import { Alert } from '@patternfly/react-core';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { EngagementDetailsViewTemplate } from '../../layout/engagement_details_view';
import { EngagementPageView } from './engagement_page_view';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { profileOnRender } from '../../utilities/profiler_callbacks';

export interface EngagementViewProps {
  currentEngagement?: Engagement;
}

export interface EngagementDetailViewProps {
  engagementFormConfig: EngagementFormConfig;
  getConfig: () => void;
  error: Error;
  setCurrentEngagement: (engagement: Engagement) => void;
  currentEngagement: Engagement;
  createEngagementPoll: (
    engagement: Engagement
  ) => Promise<{ cancel: () => void }>;
  getEngagement: (customer_name, project_name) => Promise<Engagement>;
}

const EngagementDetailView = React.memo(function({
  engagementFormConfig,
  getConfig,
  error: engagementFormRequestError,
  setCurrentEngagement,
  currentEngagement,
  getEngagement,
  createEngagementPoll,
}: EngagementDetailViewProps) {
  const { project_name, customer_name } = useParams();

  useEffect(() => {
    let engagementPoll;
    if (currentEngagement?.project_name && currentEngagement?.customer_name) {
      engagementPoll = createEngagementPoll(currentEngagement);
    }
    return async () => {
      (await engagementPoll)?.cancel?.();
    };
  }, [currentEngagement, createEngagementPoll]);
  useEffect(() => {
    Logger.instance.info('getting config');
    if (!engagementFormConfig) {
      getConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementFormConfig]);

  useEffect(() => {
    if (!customer_name || !project_name) {
      return;
    }
    getEngagement(customer_name, project_name).then(engagement => {
      if (engagement) {
        setCurrentEngagement(engagement);
      } else {
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer_name, project_name]);

  const AlertMessage = () => {
    return engagementFormRequestError ? (
      <Alert isInline title="We encountered an error." variant="danger">
        {engagementFormRequestError.message}
      </Alert>
    ) : null;
  };

  const validators = getValidatorsFromengagementFormConfig(engagementFormConfig);
  return (
    <ValidationProvider validators={validators}>
      <EngagementDetailsViewTemplate engagement={currentEngagement}>
        <AlertMessage />
        <EngagementPageView />
      </EngagementDetailsViewTemplate>
    </ValidationProvider>
  );
});

export const EngagementDetailViewContainer = () => {
  const {
    engagementFormConfig,
    getConfig,
    error,
    setCurrentEngagement,
    currentEngagement,
    getEngagement,
    createEngagementPoll,
  } = useEngagements();
  return (
    <Profiler id="Engagement Details" onRender={profileOnRender}>
      <EngagementDetailView
        engagementFormConfig={engagementFormConfig}
        getConfig={getConfig}
        createEngagementPoll={createEngagementPoll}
        error={error}
        setCurrentEngagement={setCurrentEngagement}
        currentEngagement={currentEngagement}
        getEngagement={getEngagement}
      />
    </Profiler>
  );
};
