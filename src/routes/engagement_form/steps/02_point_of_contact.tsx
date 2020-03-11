import React from "react";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput
} from "@patternfly/react-core";
import { UserIcon, EnvelopeIcon } from "@patternfly/react-icons";

const PointOfContact = ({ values, onChange }: any) => {
  return (
    <Form isHorizontal>
      <FormGroup
        fieldId="engagement_lead"
        helperText="Who is the Engagement Lead?"
        isRequired
        label="Labs EL"
      >
        <InputGroup>
          <InputGroupText component="label" htmlFor="engagement-lead">
            <UserIcon />
          </InputGroupText>
          <TextInput
            aria-label="Engagement lead name"
            id="name"
            name="engagement-lead-name"
            onChange={e => {
              onChange({ type: "engagement_lead_name", payload: e });
            }}
            placeholder="Full Name"
            type="text"
            value={values.engagement_lead_name || ''}
          />
          <InputGroupText component="label" htmlFor="engagement-lead-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            aria-label="engagement lead email"
            id="email"
            name="engagement-lead-email"
            onChange={e =>
              onChange({ type: "engagement_lead_email", payload: e })
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
          <InputGroupText component="label" htmlFor="tech-lead-name">
            <UserIcon />
          </InputGroupText>
          <TextInput
            aria-label="Tech lead name"
            id="tech-lead-name"
            name="tech-lead-name"
            onChange={e =>
              onChange({ type: "technical_lead_name", payload: e })
            }
            placeholder="Full Name"
            type="text"
            value={values.technical_lead_name || ''}
          />
          <InputGroupText component="label" htmlFor="tech-lead-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            aria-label="tech lead email"
            id="tech-lead-email"
            name="tech-lead-email"
            onChange={e =>
              onChange({ type: "technical_lead_email", payload: e })
            }
            placeholder="Email Address"
            type="email"
            value={values.technical_lead_emails || ''}
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
          <InputGroupText component="label" htmlFor="customer-contact-name">
            <UserIcon />
          </InputGroupText>
          <TextInput
            aria-label="Customer contact name"
            id="customer-contact-name"
            name="customer-contact-name"
            onChange={e =>
              onChange({ type: "customer_contact_name", payload: e })
            }
            type="text"
            placeholder="Full Name"
            value={values.customer_contact_name || ''}
          />
          <InputGroupText component="label" htmlFor="customer-contact-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            aria-label="customer contact email"
            id="customer-contact-email"
            name="customer-contact-email"
            onChange={e =>
              onChange({ type: "customer_contact_email", payload: e })
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

export default PointOfContact;
