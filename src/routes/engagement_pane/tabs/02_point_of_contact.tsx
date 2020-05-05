import React, { useContext } from 'react';
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { OMPTextInput } from '../../../components/omp_text_input';
import { UserIcon, EnvelopeIcon } from '@patternfly/react-icons';
import { FeatureToggleContext } from '../../../context/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';
import { Validators } from '../../../common/validators';

export const PointOfContact = ({ values, onChange }: any) => {
  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const { hasFeature } = useContext(FeatureToggleContext);

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };

  return (
    <Form style={tabContent} isHorizontal>
      <FormGroup
        fieldId="engagement_lead"
        helperText="Who is the Engagement Lead?"
        isRequired
        label="Labs EL"
      >
        <InputGroup>
          <InputGroupText
            style={input}
            component="label"
            htmlFor="engagement-lead"
          >
            <UserIcon />
          </InputGroupText>
          <TextInput
            aria-label="Engagement lead name"
            style={input}
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            id="name"
            name="engagement-lead-name"
            onChange={e => {
              onChange({ type: 'engagement_lead_name', payload: e });
            }}
            placeholder="Full Name"
            type="text"
            value={values.engagement_lead_name || ''}
          />
          <InputGroupText
            style={input}
            component="label"
            htmlFor="engagement-lead-email"
          >
            <EnvelopeIcon />
          </InputGroupText>
          <OMPTextInput
            validators={[
              Validators.EmailAddressValidator,
              Validators.NotNullValidator,
            ]}
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            aria-label="engagement lead email"
            id="email"
            style={input}
            name="engagement-lead-email"
            onChange={e =>
              onChange({ type: 'engagement_lead_email', payload: e })
            }
            placeholder="Email Address"
            type="email"
            value={values.engagement_lead_email || ''}
          />
        </InputGroup>
      </FormGroup>

      <FormGroup
        fieldId="technical_lead"
        isRequired
        helperText="Who is the Tech Lead?"
        label="Labs Technical Lead"
      >
        <InputGroup label="Labs Tech Lead">
          <InputGroupText
            style={input}
            component="label"
            htmlFor="tech-lead-name"
          >
            <UserIcon />
          </InputGroupText>
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            aria-label="Tech lead name"
            id="tech-lead-name"
            style={input}
            name="tech-lead-name"
            onChange={e =>
              onChange({ type: 'technical_lead_name', payload: e })
            }
            placeholder="Full Name"
            type="text"
            value={values.technical_lead_name || ''}
          />
          <InputGroupText
            style={input}
            component="label"
            htmlFor="tech-lead-email"
          >
            <EnvelopeIcon />
          </InputGroupText>
          <OMPTextInput
            validators={[
              Validators.EmailAddressValidator,
              Validators.NotNullValidator,
            ]}
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            style={input}
            aria-label="tech lead email"
            id="tech-lead-email"
            name="tech-lead-email"
            onChange={e =>
              onChange({ type: 'technical_lead_email', payload: e })
            }
            placeholder="Email Address"
            type="email"
            value={values.technical_lead_email || ''}
          />
        </InputGroup>
      </FormGroup>

      <FormGroup
        fieldId="customer-contact"
        helperText="Who is the point person for the project?"
        isRequired
        label="Customer Contact"
      >
        <InputGroup label="Customer Contact">
          <InputGroupText
            style={input}
            component="label"
            htmlFor="customer-contact-name"
          >
            <UserIcon />
          </InputGroupText>
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            style={input}
            aria-label="Customer contact name"
            id="customer-contact-name"
            name="customer-contact-name"
            onChange={e =>
              onChange({ type: 'customer_contact_name', payload: e })
            }
            type="text"
            placeholder="Full Name"
            value={values.customer_contact_name || ''}
          />
          <InputGroupText
            style={input}
            component="label"
            htmlFor="customer-contact-email"
          >
            <EnvelopeIcon />
          </InputGroupText>
          <OMPTextInput
            validators={[
              Validators.NotNullValidator,
              Validators.EmailAddressValidator,
            ]}
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            aria-label="customer contact email"
            id="customer-contact-email"
            name="customer-contact-email"
            style={input}
            onChange={e =>
              onChange({ type: 'customer_contact_email', payload: e })
            }
            placeholder="Email Address"
            type="email"
            value={values.customer_contact_email || ''}
          />
        </InputGroup>
      </FormGroup>
    </Form>
  );
};
