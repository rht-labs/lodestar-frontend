import React, { createContext } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from './engagement_hook';

export interface EngagementContext {
  getEngagements: () => void;
  engagementFormState?: Engagement;
  activeEngagement?: Engagement;
  setActiveEngagement: (Engagement: Engagement) => void;
  engagements: Engagement[];
  createEngagement: (data: any) => Promise<void>;
  saveEngagement: (data: any) => Promise<void>;
  updateEngagementFormField: (fieldName: string, payload: any) => void;

  formOptions?: {
    openshiftOptions?: any;
    providerOptions?: any;
    userManagementOptions?: any;
  };
  error: any;
  isLoading: boolean;
  launchEngagement: (data: any) => Promise<void>;
}

export const EngagementContext = createContext<EngagementContext>(null);

const { Provider } = EngagementContext;

export const EngagementProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const {
    engagements,
    setActiveEngagement,
    activeEngagement,
    error,
    formOptions,
    isLoading,
    updateEngagementFormField,
    fetchEngagements,
    createEngagement,
    saveEngagement,
    launchEngagement,
    engagementFormState,
  } = useEngagements();

  return (
    <Provider
      value={{
        activeEngagement,
        setActiveEngagement,
        engagements,
        error,
        engagementFormState,
        formOptions,
        isLoading,
        updateEngagementFormField,
        getEngagements: fetchEngagements,
        createEngagement,
        saveEngagement,
        launchEngagement,
      }}
    >
      {children}
    </Provider>
  );
};
