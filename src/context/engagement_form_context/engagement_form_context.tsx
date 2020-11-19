import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useReducer,
} from 'react';
import { Engagement } from '../../schemas/engagement';
import { IEngagementContext } from '../engagement_context/engagement_context';
import {
  AnalyticsContext,
  AnalyticsCategory,
} from '../analytics_context/analytics_context';
import {
  engagementFormReducer,
  getInitialState,
} from '../engagement_context/engagement_form_reducer';
export interface IEngagementFormContext {
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

export const EngagementFormContext = createContext<IEngagementFormContext>(
  null
);

export const EngagementFormProvider = ({
  children,
  engagementContext,
  analyticsContext,
}: {
  children: any;
  engagementContext: IEngagementContext;
  analyticsContext?: AnalyticsContext;
}) => {
  const {
    saveEngagement,
    currentEngagement,
    engagementFormConfig,
  } = engagementContext;
  const [currentEngagementChanges, dispatch] = useReducer<
    (state: any, action: any) => any
  >(
    engagementFormReducer(engagementFormConfig),
    engagementFormReducer(engagementFormConfig)()
  );
  const clearCurrentChanges = useCallback(
    () =>
      dispatch({
        type: 'switch_engagement',
        payload: getInitialState(currentEngagement),
      }),
    [dispatch, currentEngagement]
  );
  useEffect(() => {
    clearCurrentChanges();
  }, [currentEngagement, engagementFormConfig, clearCurrentChanges]);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [fieldGroups, setFieldGroups] = useState<{ [key: string]: string[] }>();

  const updateEngagementFormField = useCallback(
    (fieldName: string, value: any) => {
      if (!changedFields.includes(fieldName)) {
        setChangedFields([...changedFields, fieldName]);
      }
      dispatch({ type: fieldName, payload: value });

      try {
        analyticsContext.logEvent({
          category: AnalyticsCategory.engagements,
          action: 'Update Engagement',
        });
      } catch (e) {}
    },
    [analyticsContext, changedFields]
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
    clearCurrentChanges();
  }, [
    changedFields,
    fieldGroups,
    clearCurrentChanges,
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
