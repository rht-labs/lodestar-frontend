import React, { useState, useEffect } from 'react';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { slugify } from 'transliteration';
import { FormManager } from '../../context/form_manager/form_manager';
import { HostingEnvironment } from '../../schemas/hosting_environment';

interface SubdomainFormFieldProps {
  hostingEnvironment: HostingEnvironment;
  onChange: (value: string) => void;
  isEngagementLaunched: boolean;
  suggestedSubdomain: string;
}

export function SubdomainFormField({
  onChange,
  hostingEnvironment,
  suggestedSubdomain,
}: SubdomainFormFieldProps) {
  const { hasFeature } = useFeatures();
  const [editedByUser, setEditedByUser] = useState(false);
  const getSubdomainFieldText = () => {
    if (editedByUser) {
      return hostingEnvironment?.ocp_sub_domain;
    } else {
      return hostingEnvironment?.ocp_sub_domain || suggestedSubdomain || '';
    }
  };
  const getSubdomainHelperText = () => {
    if (editedByUser) {
      return hostingEnvironment?.ocp_sub_domain;
    } else {
      if (hostingEnvironment?.ocp_sub_domain) {
        return slugify(hostingEnvironment?.ocp_sub_domain);
      } else if (hostingEnvironment?.suggested_subdomain) {
        return suggestedSubdomain;
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
          <strong>{`${getSubdomainHelperText()}`}</strong>
          <span style={{ fontStyle: 'italic' }}>{`.<region>`}</span>
          <span>{`.rht-labs.com`}</span>
        </div>
      }
    >
      <TextInput
        isRequired
        data-testid="subdomain-input"
        isDisabled={!hasFeature(APP_FEATURES.writer)}
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
