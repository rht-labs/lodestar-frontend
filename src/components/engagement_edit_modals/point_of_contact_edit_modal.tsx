import React from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  Modal,
  ModalVariant,
  Button,
  TextInput,
  InputGroupText,
  InputGroup,
  FormGroup,
  Form,
} from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { UserIcon, EnvelopeIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { useValidation } from '../../context/validation_context/validation_hook';
import { useEngagementFormField } from '../../context/engagement_context/engagement_context';
export interface PointOfContactEditModalProps {
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
  onClose: () => void;
}
export function PointOfContactEditModal({
  engagement,
  isOpen,
  onClose = () => {},
  onSave: propsOnSave,
}: PointOfContactEditModalProps) {
  const { hasFeature } = useFeatures();
  const { validate, getValidationResult } = useValidation();

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };
  const [engagementLeadName, setEngagementLeadName] = useEngagementFormField(
    'engagement_lead_name'
  );
  const [engagementLeadEmail, setEngagementLeadEmail] = useEngagementFormField(
    'engagement_lead_email'
  );
  const [technicalLeadEmail, setTechnicalLeadEmail] = useEngagementFormField(
    'technical_lead_email'
  );
  const [technicalLeadName, setTechnicalLeadName] = useEngagementFormField(
    'technical_lead_name'
  );
  const [customerContactName, setCustomerContactName] = useEngagementFormField(
    'customer_contact_name'
  );
  const [
    customerContactEmail,
    setCustomerContactEmail,
  ] = useEngagementFormField('customer_contact_email');
  const onSave = () => {
    propsOnSave(engagement);
    onClose();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
      title="Points of Contact"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button
              data-testid="poc-edit-save"
              onClick={onSave}
              data-cy={'save_point_of_contact'}
            >
              Save
            </Button>
          </div>
        }
      >
        <Form>
          <FormGroup
            fieldId="engagement_lead"
            helperText="Who is the Engagement Lead?"
            isRequired
            label="Labs EL"
            helperTextInvalid={getValidationResult(
              'engagement_lead_email'
            ).join(' ')}
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
                onChange={setEngagementLeadName}
                placeholder="Full Name"
                type="text"
                value={engagementLeadName}
                data-cy={'engagement_lead_name'}
              />
              <InputGroupText
                style={input}
                component="label"
                htmlFor="engagement-lead-email"
              >
                <EnvelopeIcon />
              </InputGroupText>
              <TextInput
                data-testid="el-email"
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                aria-label="engagement lead email"
                id="email"
                style={input}
                name="engagement-lead-email"
                onChange={e => {
                  validate('engagement_lead_email')(e);
                  setEngagementLeadEmail(e);
                }}
                placeholder="Email Address"
                type="email"
                value={engagementLeadEmail}
                data-cy={'engagement_lead_email'}
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
                onChange={setTechnicalLeadName}
                placeholder="Full Name"
                type="text"
                value={technicalLeadName}
                data-cy={'tech_lead_name'}
              />
              <InputGroupText
                style={input}
                component="label"
                htmlFor="tech-lead-email"
              >
                <EnvelopeIcon />
              </InputGroupText>
              <TextInput
                data-testid="tech-email"
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                style={input}
                aria-label="tech lead email"
                id="tech-lead-email"
                name="tech-lead-email"
                onChange={e => {
                  setTechnicalLeadEmail(e);
                  validate('technical_lead_email')(e);
                }}
                placeholder="Email Address"
                type="email"
                value={technicalLeadEmail}
                data-cy={'tech_lead_email'}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup
            fieldId="customer-contact"
            helperText="Who is the point person for the project?"
            isRequired
            label="Customer Contact"
            helperTextInvalid={getValidationResult(
              'customer_contact_email'
            ).join(' ')}
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
                onChange={setCustomerContactName}
                type="text"
                placeholder="Full Name"
                value={customerContactName}
                data-cy={'customer_contact_name'}
              />
              <InputGroupText
                style={input}
                component="label"
                htmlFor="customer-contact-email"
              >
                <EnvelopeIcon />
              </InputGroupText>
              <TextInput
                data-testid="customer-email"
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                aria-label="customer contact email"
                id="customer-contact-email"
                name="customer-contact-email"
                style={input}
                onChange={e => {
                  setCustomerContactEmail(e);
                  validate('customer_contact_email')(e);
                }}
                placeholder="Email Address"
                type="email"
                value={customerContactEmail}
                data-cy={'customer_contact_email'}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
