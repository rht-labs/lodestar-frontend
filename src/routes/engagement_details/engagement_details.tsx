import React, { useEffect, Profiler } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Logger } from '../../utilities/logger';
import { useParams } from 'react-router';
import { getValidatorsFromFormOptions } from '../../common/config_validator_adapter';
import { Alert } from '@patternfly/react-core';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { EngagementDetailsViewTemplate } from '../../layout/engagement_details_view';
import { EngagementPageView } from './implementations/engagement_page_view';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { profileOnRender } from '../../utilities/profiler_callbacks';

export interface EngagementViewProps {
  currentEngagement?: Engagement;
}

const EngagementDetailView = React.memo(function({
  formOptions,
  getConfig,
  error: engagementFormRequestError,
  setCurrentEngagement,
  currentEngagement,
  getEngagement,
  createEngagementPoll,
}: {
  formOptions: EngagementFormConfig;
  getConfig: () => void;
  error: Error;
  setCurrentEngagement: (engagement: Engagement) => void;
  currentEngagement: Engagement;
  createEngagementPoll: (engagement: Engagement) => { cancel: () => void };
  getEngagement: (customer_name, project_name) => Promise<Engagement>;
}) {
  const { project_name, customer_name } = useParams();

  useEffect(() => {
    const engagementPoll = createEngagementPoll(currentEngagement);
    return () => {
      engagementPoll.cancel();
    };
    /**
     * We only want this effect to run once per mount. We override the effects dependencies lint so that we do not have to depend on createEngagementPoll's change.
     * createEngagementPoll is idempotent, so it will not vary its output based on the state of the engagementContext. It is included in the engagement context
     * for convenience.
     */
    // eslint-disable-next-line
  }, [currentEngagement]);
  useEffect(() => {
    if (!formOptions) {
      Logger.instance.info('getting config');
      getConfig();
    }
  }, [formOptions, getConfig]);

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
  }, [customer_name, project_name, setCurrentEngagement, getEngagement]);

  const AlertMessage = () => {
    return engagementFormRequestError ? (
      <Alert isInline title="We encountered an error." variant="danger">
        {engagementFormRequestError.message}
      </Alert>
    ) : null;
  };
  useEffect(() => {
    if (!formOptions) {
      Logger.instance.info('getting config');
      getConfig();
    }
  }, [formOptions, getConfig]);

  const validators = getValidatorsFromFormOptions(formOptions);
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
    formOptions,
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
        formOptions={formOptions}
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
