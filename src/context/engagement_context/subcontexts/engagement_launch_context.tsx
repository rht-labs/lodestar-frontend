import React, { useState, useCallback } from 'react';
import { Engagement } from '../../../schemas/engagement';
import { FeedbackContext } from '../../feedback_context/feedback_context';
export interface EngagementLaunchContext {
  isLaunchable: boolean;
  requiredFields: string[];
  missingRequiredFields: string[];
  launchEngagement: (data: any) => Promise<Engagement>;
}

export const EngagementLaunchContext = React.createContext<
  EngagementLaunchContext
>(null);

interface EngagementLaunchContextProviderProps {
  children: any;
  currentEngagementChanges: Engagement;
  feedbackContext: FeedbackContext;
  onLaunch: (data: Engagement) => Promise<Engagement>;
}

export const EngagementLaunchContextProvider = ({
  children,
  currentEngagementChanges,
  feedbackContext,
  onLaunch,
}: EngagementLaunchContextProviderProps) => {
  const requiredFields = [
    'customer_contact_email',
    'customer_contact_name',
    'customer_name',
    'end_date',
    'start_date',
    'engagement_lead_email',
    'technical_lead_email',
    'engagement_lead_name',
    'technical_lead_name',
    'ocp_cloud_provider_name',
    'ocp_cloud_provider_region',
    'ocp_version',
    'ocp_cluster_size',
    'ocp_persistent_storage_size',
    'ocp_sub_domain',
    'project_name',
  ];
  const missingRequiredFields = useCallback(() => {
    return requiredFields.filter(
      field =>
        currentEngagementChanges?.[field] !== 'boolean' &&
        currentEngagementChanges?.[field] !== 'number' &&
        !currentEngagementChanges?.[field]
    );
  }, [currentEngagementChanges, requiredFields]);
  const isLaunchable = useCallback(() => {
    let result = requiredFields.every(
      o =>
        typeof currentEngagementChanges[o] === 'boolean' ||
        typeof currentEngagementChanges[o] === 'number' ||
        !!currentEngagementChanges[o]
    );
    return result;
  }, [currentEngagementChanges, requiredFields]);
  const launchEngagement = async (data: any) => {
    if (!isLaunchable()) {
      throw Error(
        'This engagement does not have the required fields to launch'
      );
    }
    feedbackContext.showLoader();
    return await onLaunch(data);
  };
  return (
    <EngagementLaunchContext.Provider
      value={{
        isLaunchable: isLaunchable(),
        requiredFields,
        missingRequiredFields: missingRequiredFields(),
        launchEngagement,
      }}
    >
      {children}
    </EngagementLaunchContext.Provider>
  );
};
