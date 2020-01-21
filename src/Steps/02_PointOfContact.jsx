import React from "react";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput
} from "@patternfly/react-core";
import { UserIcon, EnvelopeIcon } from "@patternfly/react-icons";

const PointOfContact = ({ values, onChange }) => {
  return (
    <Form isHorizontal>
      <FormGroup
        label="Labs EL"
        isRequired
        fieldId="engagement_lead"
        helperText="Who is the Engagement Lead on this residency?"
      >
        <InputGroup>
          <InputGroupText component="label" htmlFor="engagement-lead">
            <UserIcon />
          </InputGroupText>
          <TextInput
            name="engagement-lead-name"
            id="name"
            type="text"
            aria-label="Engagement lead name"
            placeholder="Name"
            onChange={e =>
              onChange({ type: "engagement_lead_name", payload: e })
            }
          />
          <InputGroupText component="label" htmlFor="engagement-lead-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            name="engagement-lead-email"
            id="email"
            type="email"
            aria-label="engagement lead email"
            placeholder="Email Address"
            onChange={e =>
              onChange({ type: "engagement_lead_email", payload: e })
            }
          />
        </InputGroup>
      </FormGroup>

      <FormGroup
        label="Labs Technical Lead"
        isRequired
        fieldId="technical_lead"
        helperText="Who is the Tech Lead on this residency?"
      >
        <InputGroup label="Labs Tech Lead">
          <InputGroupText component="label" htmlFor="tech-lead-name">
            <UserIcon />
          </InputGroupText>
          <TextInput
            name="tech-lead-name"
            id="tech-lead-name"
            type="text"
            aria-label="Tech lead name"
            placeholder="Name"
            onChange={e =>
              onChange({ type: "technical_lead_name", payload: e })
            }
          />
          <InputGroupText component="label" htmlFor="tech-lead-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            name="tech-lead-email"
            id="tech-lead-email"
            type="email"
            aria-label="tech lead email"
            placeholder="Email Address"
            onChange={e =>
              onChange({ type: "technical_lead_email", payload: e })
            }
          />
        </InputGroup>
      </FormGroup>

      <FormGroup
        label="Customer Contact"
        isRequired
        fieldId="customer-contact"
        helperText="Who is the main point of contact for the customer?"
      >
        <InputGroup label="Customer Contact">
          <InputGroupText component="label" htmlFor="customer-contact-name">
            <UserIcon />
          </InputGroupText>
          <TextInput
            name="customer-contact-name"
            id="customer-contact-name"
            type="text"
            aria-label="Customer contact name"
            onChange={e =>
              onChange({ type: "customer_contact_name", payload: e })
            }
            placeholder="Name"
          />
          <InputGroupText component="label" htmlFor="customer-contact-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            name="customer-contact-email"
            id="customer-contact-email"
            type="email"
            aria-label="customer contact email"
            placeholder="Email Address"
            onChange={e =>
              onChange({ type: "customer_contact_email", payload: e })
            }
          />
        </InputGroup>
      </FormGroup>
    </Form>
  );
};

export default PointOfContact;
