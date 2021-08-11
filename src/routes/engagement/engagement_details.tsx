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
import { EngagementJsonDump } from './json_dump';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { TextContent, Grid, GridItem } from '@patternfly/react-core';
import { ActivityHistoryCard } from '../../components/engagement_data_cards/activity_history_card/activity_history_card';
import { EngagementArtifactCard } from '../../components/engagement_data_cards/engagement_artifact_card/engagement_artifact_card';
import { EngagementSummaryCard } from '../../components/engagement_data_cards/engagement_summary_card/engagement_summary_card';
import { HostingEnvironmentCard } from '../../components/engagement_data_cards/hosting_environment_card/hosting_environment_card';
import { PointOfContactCard } from '../../components/engagement_data_cards/point_of_contact_card/point_of_contact_card';
import { SystemStatusCard } from '../../components/engagement_data_cards/system_status_card/system_status_card';
import { UserCard } from '../../components/engagement_data_cards/user_card/user_card';
import { FeatureToggles } from '../../context/feature_context/feature_toggles';
import { useFeatures } from '../../context/feature_context/feature_hook';

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

  const {features=[]} = useFeatures();

  const {
    createEngagementPoll,
    saveEngagement,
    currentEngagement,
    currentChanges,
    engagementFormConfig,
    fetchEngagementFormConfig,
  } = useEngagement({
    projectName: project_name,
    customerName: customer_name,
    uuid: engagementUuid,
  });

  const isWriteable = currentEngagement?.writeable ?? false;

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
  useEffect(() => {
    fetchEngagementFormConfig(currentEngagement?.engagement_type);
  }, [currentEngagement?.engagement_type, fetchEngagementFormConfig]);
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
    <FeatureToggles features={[...features, ...(isWriteable ? ["engagementWriter" ] : [])]}>
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
              <TextContent>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <div id="engagement_summary_card">
                      <EngagementSummaryCard />
                    </div>
                  </GridItem>
                  {currentEngagement?.launch ? (
                    <GridItem span={12}>
                      <div id="system_status_card">
                        <SystemStatusCard currentEngagement={currentEngagement} />
                      </div>
                    </GridItem>
                  ) : (
                    <></>
                  )}
                  <GridItem span={12}>
                    <div id="poc_card">
                      <PointOfContactCard />
                    </div>
                  </GridItem>
                  <GridItem span={12}>
                    <div id="user_card">
                      <UserCard />
                    </div>
                  </GridItem>
                  <GridItem span={12}>
                    <div id="oc_summary_card">
                      <HostingEnvironmentCard />
                    </div>
                  </GridItem>
                  <GridItem span={12}>
                    <div id="artifacts">
                      <EngagementArtifactCard />
                    </div>
                  </GridItem>
                  <GridItem span={12}>
                    <div id="activity_card">
                      <ActivityHistoryCard />
                    </div>
                  </GridItem>
                </Grid>
              </TextContent>{' '}
            </Route>
          </Switch>
        </EngagementDetailsViewTemplate>
      </ValidationProvider>
    </FeatureToggles>
  );
};
