import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Logger } from '../../utilities/logger';
import { useParams } from 'react-router';
import { EngagementTabView } from './implementations/engagement_tab_view';
import { getValidatorsFromFormOptions } from '../../common/config_validator_adapter';
import { Alert } from '@patternfly/react-core';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { EngagementDetailsViewTemplate } from '../../layout/engagement_details_view';

export interface EngagementViewProps {
  engagement?: Engagement;
}

export function EngagementDetailView(props) {
  const { project_name, customer_name } = useParams();

  const {
    formOptions,
    getConfig,
    error,
    setActiveEngagement,
    activeEngagement,
    getEngagement,
  } = useEngagements();
  useEffect(() => {
    if (!formOptions) {
      Logger.info('getting config');
      getConfig();
    }
  }, [formOptions, getConfig]);

  useEffect(() => {
    if (!customer_name || !project_name) {
      return;
    }
    getEngagement(customer_name, project_name).then(engagement => {
      if (engagement) {
        setActiveEngagement(engagement);
      } else {
      }
    });
  });
  const engagementFormRequestError = error;

  const AlertMessage = () => {
    return engagementFormRequestError ? (
      <Alert isInline title="We encountered an error." variant="danger">
        {engagementFormRequestError.message}
      </Alert>
    ) : null;
  };
  useEffect(() => {
    if (!formOptions) {
      Logger.info('getting config');
      getConfig();
    }
  }, [formOptions, getConfig]);

  useEffect(() => {
    if (!customer_name || !project_name) {
      return;
    }
    getEngagement(customer_name, project_name).then(engagement => {
      if (engagement) {
        setActiveEngagement(engagement);
      } else {
      }
    });
  });
  const validators = getValidatorsFromFormOptions(formOptions);

  return (
    <ValidationProvider validators={validators}>
      <EngagementDetailsViewTemplate engagement={activeEngagement}>
        <AlertMessage />
        <EngagementTabView engagement={activeEngagement} />
      </EngagementDetailsViewTemplate>
    </ValidationProvider>
  );
}
