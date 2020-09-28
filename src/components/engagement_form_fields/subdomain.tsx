import React, { useState, useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { slugify } from 'transliteration';
import { FormManager } from '../../context/form_manager/form_manager';

interface SubdomainFormFieldProps {
  engagement: Engagement;
  engagementFormConfig: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}

export function SubdomainFormField({
  onChange,
  engagement,
}: SubdomainFormFieldProps) {
  const { hasFeature } = useFeatures();
  const [editedByUser, setEditedByUser] = useState(false);
  const getSubdomainFieldText = () => {
    if (editedByUser) {
      return engagement?.ocp_sub_domain;
    } else {
      return (
        engagement?.ocp_sub_domain || engagement?.suggested_subdomain || ''
      );
    }
  };
  const getSubdomainHelperText = () => {
    if (editedByUser) {
      return engagement?.ocp_sub_domain;
    } else {
      if (engagement?.ocp_sub_domain) {
        return slugify(engagement?.ocp_sub_domain);
      } else if (engagement?.suggested_subdomain) {
        return engagement?.suggested_subdomain;
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
          <strong>{`${getSubdomainHelperText()}.${engagement.engagement_region ??
            'na'}-1.rht-labs.com`}</strong>
        </div>
      }
    >
      <TextInput
        isRequired
        data-testid="subdomain-input"
        isDisabled={!hasFeature(APP_FEATURES.writer) || !!engagement?.launch}
        type="text"
        id="ocp_sub_domain"
        name="ocp_sub_domain"
        data-cy={'desired_subdomain_input'}
        value={getSubdomainFieldText()}
        onChange={e => {
          if (!editedByUser) {
            setEditedByUser(true);
          }
          onChange('ocp_sub_domain', e);
        }}
      />
    </FormGroup>
  );
}
