import React, { useEffect } from 'react';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Logger } from '../../utilities/logger';
import { useParams } from 'react-router';
import { EngagementViewProps } from '.';

interface EngagementTabViewProps extends EngagementViewProps {}

export function EngagementTabView(props: EngagementTabViewProps) {
  const { project_name, customer_name } = useParams();

  const {
    formOptions,
    getConfig,
    error,
    engagementFormState,
    updateEngagementFormField,
    setActiveEngagement,
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
  return <div />;
}
