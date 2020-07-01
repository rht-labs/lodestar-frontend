import React from 'react';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { EngagementOverviewTab } from '../tab_views/overview';

export function EngagementPageView() {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
    saveEngagement,
    activeEngagement,
    missingRequiredFields,
  } = useEngagements();

  return (
    <>
      <EngagementOverviewTab
        activeEngagement={activeEngagement}
        missingRequiredFields={missingRequiredFields}
        onSave={saveEngagement}
        formOptions={formOptions}
        onChange={updateEngagementFormField}
        engagementFormState={engagementFormState}
      />
    </>
  );
}
