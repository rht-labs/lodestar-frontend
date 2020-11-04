import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Engagement } from '../../schemas/engagement';
import { EngagementContext } from '../engagement_context/engagement_context';
import {
  AnalyticsContext,
  AnalyticsCategory,
} from '../analytics_context/analytics_context';

export interface EngagementFormContext {
  currentChanges: Engagement;
  clearCurrentChanges: () => void;
  updateEngagementFormField: (
    fieldName: keyof Engagement,
    payload: any
  ) => void;
  fieldGroups: { [key: string]: string[] };
  saveChanges: () => void;
  setFieldGroups: (fieldGroups: { [key: string]: string[] }) => void;
}

export const EngagementFormContext = createContext<EngagementFormContext>(null);

export const EngagementFormProvider = ({
  children,
  engagementContext,
  analyticsContext,
}: {
  children: any;
  engagementContext: EngagementContext;
  analyticsContext?: AnalyticsContext;
}) => {
  const {
    saveEngagement,
    currentEngagement,
    engagementFormConfig,
  } = engagementContext;
  const [currentEngagementChanges, setCurrentEngagementChanges] = useState<
    Partial<Engagement>
  >({});
  useEffect(() => {
    setCurrentEngagementChanges({});
  }, [currentEngagement, engagementFormConfig]);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [fieldGroups, setFieldGroups] = useState<{ [key: string]: string[] }>();

  const clearCurrentChanges = () => setCurrentEngagementChanges({});
  const updateEngagementFormField = useCallback(
    (fieldName: string, value: any) => {
      if (!changedFields.includes(fieldName)) {
        setChangedFields([...changedFields, fieldName]);
      }
      setCurrentEngagementChanges({
        ...currentEngagementChanges,
        [fieldName]: value,
      });
      try {
        analyticsContext.logEvent({
          category: AnalyticsCategory.engagements,
          action: 'Update Engagement',
        });
      } catch (e) {}
    },
    [analyticsContext, changedFields, currentEngagementChanges]
  );
  const saveChanges = useCallback(() => {
    const _createCommitMessage = (
      changedFields: string[],
      fieldGroupings: { [key: string]: string[] } = {}
    ): string => {
      const changedGroups = Array.from(
        new Set(
          changedFields
            .map(field =>
              Object.keys(fieldGroupings).find(group =>
                fieldGroupings[group].includes(field)
              )
            )
            .filter(group => !!group)
        )
      );
      const commitMessage = `Changed ${changedGroups.join(
        ', '
      )}\nThe following fields were changed:\n${changedFields.join('\n')}`;
      return commitMessage;
    };
    const commitMessage = _createCommitMessage(changedFields, fieldGroups);
    saveEngagement(
      { ...currentEngagement, ...currentEngagementChanges },
      commitMessage
    );
    setChangedFields([]);
    setCurrentEngagementChanges({});
  }, [
    changedFields,
    fieldGroups,
    setCurrentEngagementChanges,
    setChangedFields,
    saveEngagement,
    currentEngagement,
    currentEngagementChanges,
  ]);
  return (
    <EngagementFormContext.Provider
      value={{
        fieldGroups,
        currentChanges: {
          ...currentEngagement,
          ...currentEngagementChanges,
        },
        clearCurrentChanges,
        updateEngagementFormField,
        saveChanges,
        setFieldGroups,
      }}
    >
      {children}
    </EngagementFormContext.Provider>
  );
};
