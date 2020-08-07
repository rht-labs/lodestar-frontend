import React from 'react';
import { useHistory } from 'react-router';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { getValidatorsFromFormOptions } from '../../common/config_validator_adapter';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { CreateEngagementPage } from './create_engagement_page';
import { PageSection, Title } from '@patternfly/react-core';

export function CreateNewEngagement() {
  const history = useHistory();
  const { createEngagement } = useEngagements();
  const submitNewEngagement = async (
    customerName?: string,
    projectName?: string
  ) => {
    if (customerName && projectName) {
      await createEngagement({
        customer_name: customerName,
        project_name: projectName,
      });
      history.push(`/app/engagements/${customerName}/${projectName}`);
    } else {
      history.push('/app/engagements');
    }
  };

  const { formOptions } = useEngagements();

  return (
    <div >
      <ValidationProvider
        validators={getValidatorsFromFormOptions(formOptions)}
      >
        <PageSection >
          <Title headingLevel="h1">Create New Engagement</Title>
          <CreateEngagementPage onSubmit={submitNewEngagement} />
        </PageSection>
      </ValidationProvider>
    </div>
  );
}
