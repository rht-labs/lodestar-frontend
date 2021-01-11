import React, { useState } from 'react';
import { FormGroup, TextInput, Tooltip } from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { slugify } from 'transliteration';
import { HostingEnvironment } from '../../schemas/hosting_environment';
import { InfoCircleIcon } from '@patternfly/react-icons';

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
      return hostingEnvironment?.ocp_sub_domain?.toLowerCase?.();
    } else {
      return (
        hostingEnvironment?.ocp_sub_domain ??
        suggestedSubdomain ??
        ''
      )?.toLowerCase?.();
    }
  };
  const getSubdomainHelperText = () => {
    if (editedByUser) {
      return hostingEnvironment?.ocp_sub_domain;
    } else {
      if (hostingEnvironment?.ocp_sub_domain) {
        return slugify(hostingEnvironment?.ocp_sub_domain);
      } else if (suggestedSubdomain) {
        return suggestedSubdomain;
      } else {
        return '<desired-subdomain>';
      }
    }
  };

  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('subdomain'), [registerField]);
  const hasUpperCase = (s: string) => {
    return /A-Z/.test(s);
  };

  const subdomainValue = getSubdomainFieldText();
  return (
    <FormGroup
      label="Desired Subdomain"
      isRequired
      fieldId="subdomain"
      validated={hasUpperCase(subdomainValue) ? 'error' : 'default'}
      helperText={
        <div>
          Applications will live at:&nbsp;
          <strong>{`${getSubdomainHelperText()}`}</strong>
          <span style={{ fontStyle: 'italic' }}>{`.region.example.com`}</span>
          &nbsp;&nbsp;
          <Tooltip content="The full domain is shown as an example. The actual domain(s) used within the environment(s) will be available as part of the status once the engagement is launched">
            <InfoCircleIcon></InfoCircleIcon>
          </Tooltip>
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
        value={subdomainValue}
        onChange={e => {
          if (!editedByUser) {
            setEditedByUser(true);
          }
          onChange(e.toLowerCase());
        }}
      />
    </FormGroup>
  );
}
