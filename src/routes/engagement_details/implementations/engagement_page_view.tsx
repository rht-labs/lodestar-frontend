import React from 'react';
import { EngagementViewProps } from '..';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
import { EngagementOverviewTab } from '../tab_views/overview';
interface EngagementPageViewProps extends EngagementViewProps {}

export function EngagementPageView({ engagement }: EngagementPageViewProps) {
  const {
    formOptions,
    engagementFormState,
    updateEngagementFormField,
    saveEngagement,
  } = useEngagements();

  return (
    <>
      <EngagementOverviewTab
        onSave={saveEngagement}
        formOptions={formOptions}
        onChange={updateEngagementFormField}
        engagement={engagementFormState}
      />
    </>
  );
}
