import React, { useState, useEffect } from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { slugify } from 'transliteration';
import { FormManager } from '../../context/form_manager/form_manager';
import { HostingProvider } from '../../schemas/hosting_provider';

interface SubdomainFormFieldProps {
  hostingProvider: HostingProvider;
  engagementFormConfig: EngagementFormConfig;
  onChange: (value: string) => void;
  isEngagementLaunched: boolean;
}

export function SubdomainFormField({
  onChange,
  hostingProvider,
  isEngagementLaunched,
}: SubdomainFormFieldProps) {
  const { hasFeature } = useFeatures();
  const [editedByUser, setEditedByUser] = useState(false);
  const getSubdomainFieldText = () => {
    if (editedByUser) {
      return hostingProvider?.ocp_sub_domain;
    } else {
      return (
        hostingProvider?.ocp_sub_domain ||
        hostingProvider?.suggested_subdomain ||
        ''
      );
    }
  };
  const getSubdomainHelperText = () => {
    if (editedByUser) {
      return hostingProvider?.ocp_sub_domain;
    } else {
      if (hostingProvider?.ocp_sub_domain) {
        return slugify(hostingProvider?.ocp_sub_domain);
      } else if (hostingProvider?.suggested_subdomain) {
        return hostingProvider?.suggested_subdomain;
      } else {
        return '<desired-subdomain>';
      }
    }
  };
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('subdomain'), [registerField]);

  return (
    <FormGroup
      label="Desired Subdomain"
      isRequired
      fieldId="subdomain"
      helperText={
        <div>
          Applications will live at:&nbsp;
          <strong>{`${getSubdomainHelperText()}.${'na'}-1.rht-labs.com`}</strong>
        </div>
      }
    >
      <TextInput
        isRequired
        data-testid="subdomain-input"
        isDisabled={!hasFeature(APP_FEATURES.writer) || isEngagementLaunched}
        type="text"
        id="ocp_sub_domain"
        name="ocp_sub_domain"
        data-cy={'desired_subdomain_input'}
        value={getSubdomainFieldText()}
        onChange={e => {
          if (!editedByUser) {
            setEditedByUser(true);
          }
          onChange(e);
        }}
      />
    </FormGroup>
  );
}
