import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
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
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { UserIcon, EnvelopeIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_toggles/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { useValidation } from '../../context/validation_context/validation_hook';
export interface PointOfContactEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  formOptions: object;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
}
export function PointOfContactEditModal({
  onChange,
  engagement,
  isOpen,
  onSave: propsOnSave,
}: PointOfContactEditModalProps) {
  const { requestClose } = useModalVisibility();
  const { hasFeature } = useFeatures();

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };
  const { validate, getValidationResult } = useValidation();

  const onSave = () => {
    propsOnSave(engagement);
    requestClose();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={requestClose}
      title="Points of Contact"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={onSave} data-cy={'save_point_of_contact'}>
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
                onChange={e => {
                  onChange('engagement_lead_name', e);
                }}
                placeholder="Full Name"
                type="text"
                value={engagement.engagement_lead_name || ''}
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
                value={engagement.engagement_lead_email || ''}
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
                onChange={e => onChange('technical_lead_name', e)}
                placeholder="Full Name"
                type="text"
                value={engagement.technical_lead_name || ''}
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
                value={engagement.technical_lead_email || ''}
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
                onChange={e => onChange('customer_contact_name', e)}
                type="text"
                placeholder="Full Name"
                value={engagement.customer_contact_name || ''}
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
                value={engagement.customer_contact_email || ''}
                data-cy={'customer_contact_email'}
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
