import React from 'react';
import {
    Form,
    FormGroup,
    InputGroup,
    InputGroupText,
    TextInput } from '@patternfly/react-core';
import { UserIcon, EnvelopeIcon } from '@patternfly/react-icons';

const PointOfContact = () => {
  return(
    <Form isHorizontal>
      <FormGroup
         label="Labs EL"
         isRequired
         fieldId="engagement-lead"
         helperText="Who is the Engagement Lead on this residency?"
      >
        <InputGroup
        >
          <InputGroupText
            component="label"
            htmlFor="engagement-lead"
          >
            <UserIcon />
          </InputGroupText>
           <TextInput
            name="engagement-lead-name"
            id="engagement-lead-name"
            type="text"
            aria-label="Engagement lead name"
            placeholder="Name"
          />
          <InputGroupText
            component="label"
            htmlFor="engagement-lead-email"
          >
            <EnvelopeIcon />
          </InputGroupText>
           <TextInput
            name="engagement-lead-email"
            id="engagement-lead-email"
            type="email"
            aria-label="engagement lead email"
            placeholder="Email Address"
          />
        </InputGroup>
      </FormGroup>

      <FormGroup
         label="Labs Tech Lead"
         isRequired
         fieldId="tech-lead"
         helperText="Who is the Tech Lead on this residency?"
      >
        <InputGroup
           label="Labs Tech Lead"
        >
          <InputGroupText
            component="label"
            htmlFor="tech-lead-name"
          >
            <UserIcon />
          </InputGroupText>
           <TextInput
            name="tech-lead-name"
            id="tech-lead-name"
            type="text"
            aria-label="Tech lead name"
            placeholder="Name"
          />
          <InputGroupText
            component="label"
            htmlFor="tech-lead-email"
          >
            <EnvelopeIcon />
          </InputGroupText>
           <TextInput
            name="tech-lead-email"
            id="tech-lead-email"
            type="email"
            aria-label="tech lead email"
            placeholder="Email Address"
          />
        </InputGroup>
      </FormGroup>

      <FormGroup
         label="Customer Contact"
         isRequired
         fieldId="customer-contact"
         helperText="Who is the main point of contact for the customer?"
      >
        <InputGroup
           label="Customer Contact"
        >
          <InputGroupText
            component="label"
            htmlFor="customer-contact-name"
          >
            <UserIcon />
          </InputGroupText>
           <TextInput
            name="customer-contact-name"
            id="customer-contact-name"
            type="text"
            aria-label="Customer contact name"
            placeholder="Name"
          />
          <InputGroupText
            component="label"
            htmlFor="customer-contact-email"
          >
            <EnvelopeIcon />
          </InputGroupText>
           <TextInput
            name="customer-contact-email"
            id="customer-contact-email"
            type="email"
            aria-label="customer contact email"
            placeholder="Email Address"
          />
        </InputGroup>
      </FormGroup>


    </Form>
  )
}

export default PointOfContact;
