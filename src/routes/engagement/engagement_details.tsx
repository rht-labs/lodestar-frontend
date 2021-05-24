import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useEngagement } from '../../context/engagement_context/engagement_hook';
import { Route, useParams, Switch, useRouteMatch } from 'react-router';
import { getValidatorsFromEngagementFormConfig } from '../../common/config_validator_adapter';
import {
  ValidationProvider,
  FormValidator,
} from '../../context/validation_context/validation_context';
import { EngagementDetailsViewTemplate } from '../../layout/engagement_details_view';
import { EngagementOverview } from './overview';
import { EngagementJsonDump } from './json_dump';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';

export interface EngagementViewProps {
  currentEngagement?: Engagement;
}

export interface EngagementDetailViewProps {
  error: Error;
  currentEngagement: Engagement;
  createEngagementPoll: (
    engagement: Engagement
  ) => Promise<{ cancel: () => void }>;
  getEngagement: (
    customer_name: string,
    project_name: string
  ) => Promise<Engagement>;
}
export const validatorsWithDateValidators = (
  validators: FormValidator,
  dates: Pick<Engagement, 'start_date' | 'end_date'>
): FormValidator => {
  return {
    ...validators,
    end_date: [
      ...(validators['end_date'] ?? []),
      endDate => {
        const result =
          dates?.start_date > endDate
            ? 'End date must be after the start date'
            : null;
        return result;
      },
    ],
    archive_date: [
      ...(validators['archive_date'] ?? []),
      archiveDate => {
        const result =
          archiveDate < dates?.end_date
            ? 'Archive date must be after the end date'
            : null;
        return result;
      },
    ],
  };
};

export const EngagementDetailView = () => {
  const { project_name, customer_name, uuid: engagementUuid } = useParams<{
    customer_name: string;
    project_name: string;
    uuid: string;
  }>();

  const {
    createEngagementPoll,
    saveEngagement,
    currentEngagement,
    currentChanges,
    engagementFormConfig,
  } = useEngagement({
    projectName: project_name,
    customerName: customer_name,
    uuid: engagementUuid,
  });

  useEffect(() => {
    let engagementPoll;
    if (currentEngagement?.project_name && currentEngagement?.customer_name) {
      engagementPoll = createEngagementPoll(currentEngagement);
    }
    return async () => {
      (await engagementPoll)?.cancel?.();
    };
  }, [currentEngagement, createEngagementPoll]);

  const validators = getValidatorsFromEngagementFormConfig(
    engagementFormConfig
  );
  const { url } = useRouteMatch();
  const serializer = new EngagementJsonSerializer();
  const {
    commits,
    uuid,
    project_id,
    mongo_id,
    creation_details,
    status,
    launch,
    ...editableFields
  } = currentEngagement ?? {};
  const { end_date, start_date } = currentChanges;

  return (
    <ValidationProvider
      validators={validatorsWithDateValidators(validators, {
        end_date,
        start_date,
      })}
    >
      <EngagementDetailsViewTemplate
        engagement={currentEngagement}
        onSave={saveEngagement}
      >
        <Switch>
          <Route path={`${url}/json`}>
            <EngagementJsonDump
              json={JSON.stringify(
                serializer.serialize((editableFields ?? {}) as Engagement),
                null,
                2
              )}
              onSave={value => {
                saveEngagement(serializer.deserialize(JSON.parse(value)));
              }}
            />
          </Route>
          <Route path={`/`}>
            <EngagementOverview />
          </Route>
        </Switch>
      </EngagementDetailsViewTemplate>
    </ValidationProvider>
  );
};
