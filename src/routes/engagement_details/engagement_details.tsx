import React, { useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import {
  Route,
  useParams,
  Switch,
  useRouteMatch,
  Redirect,
} from 'react-router';
import { getValidatorsFromEngagementFormConfig } from '../../common/config_validator_adapter';
import { Alert } from '@patternfly/react-core';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { EngagementDetailsViewTemplate } from '../../layout/engagement_details_view';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { EngagementOverview } from './overview';
import { useEngagementForm } from '../../context/engagement_form_context/engagement_form_hook';
import { EngagementJsonDump } from './json_dump';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { Feature } from '../../components/feature/feature';
import { APP_FEATURES } from '../../common/app_features';

export interface EngagementViewProps {
  currentEngagement?: Engagement;
}

export interface EngagementDetailViewProps {
  engagementFormConfig: EngagementFormConfig;
  getConfig: () => void;
  error: Error;
  setCurrentEngagement: (engagement: Engagement) => void;
  currentEngagement: Engagement;
  createEngagementPoll: (
    engagement: Engagement
  ) => Promise<{ cancel: () => void }>;
  getEngagement: (customer_name, project_name) => Promise<Engagement>;
}

export const EngagementDetailView = () => {
  const { project_name, customer_name } = useParams<{
    customer_name: string;
    project_name: string;
  }>();

  const {
    engagementFormConfig,
    getConfig,
    createEngagementPoll,
    saveEngagement,
    error: engagementFormRequestError,
    setCurrentEngagement,
    getEngagement,
    currentEngagement,
    missingRequiredFields,
  } = useEngagements();

  const {
    saveChanges,
    currentChanges,
    updateEngagementFormField,
    clearCurrentChanges,
  } = useEngagementForm();
  useEffect(() => {
    let engagementPoll;
    if (currentEngagement?.project_name && currentEngagement?.customer_name) {
      engagementPoll = createEngagementPoll(currentEngagement);
    }
    return async () => {
      (await engagementPoll)?.cancel?.();
    };
  }, [currentEngagement, createEngagementPoll]);
  useEffect(() => {
    if (!engagementFormConfig) {
      getConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementFormConfig]);

  useEffect(() => {
    if (!customer_name || !project_name) {
      return;
    }
    getEngagement(customer_name, project_name).then(engagement => {
      if (engagement) {
        setCurrentEngagement(engagement);
      } else {
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer_name, project_name]);

  const AlertMessage = () => {
    return engagementFormRequestError ? (
      <Alert isInline title="We encountered an error." variant="danger">
        {engagementFormRequestError.message}
      </Alert>
    ) : null;
  };

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

  return (
    <ValidationProvider validators={validators}>
      <EngagementDetailsViewTemplate
        engagement={currentEngagement}
        onSave={saveChanges}
      >
        <AlertMessage />
        <Switch>
          <Route path={`${url}/json`}>
            <Feature
              inactiveComponent={() => <Redirect to={url} />}
              name={APP_FEATURES.admin}
            >
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
            </Feature>
          </Route>
          <Route path={`${url}/`}>
            <EngagementOverview
              currentEngagement={currentEngagement}
              missingRequiredFields={missingRequiredFields}
              onSave={saveChanges}
              engagementFormConfig={engagementFormConfig}
              onChange={updateEngagementFormField}
              currentEngagementChanges={currentChanges}
              clearCurrentChanges={clearCurrentChanges}
            />
          </Route>
        </Switch>
      </EngagementDetailsViewTemplate>
    </ValidationProvider>
  );
};
