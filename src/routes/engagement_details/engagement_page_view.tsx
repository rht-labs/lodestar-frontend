import React from 'react';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { EngagementOverview } from './overview';

export function EngagementPageView() {
  const {
    engagementFormConfig,
    currentEngagementChanges,
    updateEngagementFormField,
    saveEngagement,
    currentEngagement,
    missingRequiredFields,
  } = useEngagements();

  return (
    <>
      <EngagementOverview
        currentEngagement={currentEngagement}
        missingRequiredFields={missingRequiredFields}
        onSave={saveEngagement}
        engagementFormConfig={engagementFormConfig}
        onChange={updateEngagementFormField}
        currentEngagementChanges={currentEngagementChanges}
      />
    </>
  );
}
