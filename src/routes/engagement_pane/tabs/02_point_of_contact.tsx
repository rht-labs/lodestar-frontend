import React, { useContext } from 'react';
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { UserIcon, EnvelopeIcon } from '@patternfly/react-icons';
import { FeatureToggleContext } from '../../../context/feature_toggles/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';
import { useValidation } from '../../../context/validation_context/validation_hook';

export const PointOfContact = ({ values, onChange }: any) => {
  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const { hasFeature } = useContext(FeatureToggleContext);

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };
  const { validate, getValidationResult } = useValidation();

  return (
    <Form style={tabContent} isHorizontal>
      <FormGroup
        fieldId="engagement_lead"
        helperText="Who is the Engagement Lead?"
        isRequired
        label="Labs EL"
        helperTextInvalid={getValidationResult('engagement_lead_email').join(
          ' '
        )}
        validated={
          getValidationResult('engagement_lead_email').length > 0
            ? 'error'
            : 'default'
        }
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
              onChange('engagement_lead_name', e);
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
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            aria-label="engagement lead email"
            id="email"
            style={input}
            name="engagement-lead-email"
            onChange={e =>
              validate('engagement_lead_email')(e) &&
              onChange('engagement_lead_email', e)
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
        helperTextInvalid={getValidationResult('technical_lead_email').join(
          ' '
        )}
        validated={
          getValidationResult('technical_lead_email').length > 0
            ? 'error'
            : 'default'
        }
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
            onChange={e => onChange('technical_lead_name', e)}
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
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            style={input}
            aria-label="tech lead email"
            id="tech-lead-email"
            name="tech-lead-email"
            onChange={e =>
              validate('technical_lead_email')(e) &&
              onChange('technical_lead_email', e)
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
        helperTextInvalid={getValidationResult('customer_contact_email').join(
          ' '
        )}
        validated={
          getValidationResult('customer_contact_email').length > 0
            ? 'error'
            : 'default'
        }
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
            onChange={e => onChange('customer_contact_name', e)}
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
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            aria-label="customer contact email"
            id="customer-contact-email"
            name="customer-contact-email"
            style={input}
            onChange={e =>
              validate('customer_contact_email')(e) &&
              onChange('customer_contact_email', e)
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
