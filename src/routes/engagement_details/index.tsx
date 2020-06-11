import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Logger } from '../../utilities/logger';
import { useParams } from 'react-router';
import { EngagementTabView } from './engagement_detail_view_implementations/engagement_tab_view';
import { ValidatorFactory } from '../../schemas/validators';
import {
  Alert,
  PageSection,
  TextContent,
  Text,
  PageSectionVariants,
} from '@patternfly/react-core';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { ValidationProvider } from '../../context/validation_context/validation_context';

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
      <EngagementViewTemplate engagement={activeEngagement}>
        <AlertMessage />
        <EngagementTabView engagement={activeEngagement} />
      </EngagementViewTemplate>
    </ValidationProvider>
  );
}

const getValidatorsFromFormOptions = (formOptions: EngagementFormConfig = {}) =>
  Object.keys(formOptions || {}).reduce((acc, groupingKey) => {
    return {
      ...acc,
      ...Object.keys(formOptions[groupingKey] ?? {}).reduce(
        (acc, k) => ({
          ...acc,
          [k]: (formOptions?.[groupingKey]?.[k]?.validators || []).map(
            ValidatorFactory
          ),
        }),
        {}
      ),
    };
  }, {});

function EngagementViewTemplate({
  engagement,
  children,
}: {
  engagement: Engagement;
  children: any;
}) {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{engagement?.project_name}</Text>
          <Text component="h3">{engagement?.customer_name}</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>{children}</PageSection>
    </>
  );
}
