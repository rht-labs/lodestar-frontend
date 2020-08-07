import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { getValidatorsFromFormOptions } from '../../common/config_validator_adapter';
import {
  PageSection,
  Title,
  PageSectionVariants,
  Select,
  SelectOption,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  Text,
} from '@patternfly/react-core';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { CustomerSelectDropdown } from '../../components/customer_select_dropdown/customer_select_dropdown';
import { useValidation } from '../../context/validation_context/validation_hook';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { SectionTitle } from '../../components/section_title/section_title';

const REGIONS = [
  {
    label: 'APAC',
    value: 'APAC',
  },
  { label: 'EMEA', value: 'EMEA' },
  { label: 'NA', value: 'NA' },
  { label: 'LATAM', value: 'LATAM' },
  { label: 'Global', value: 'global' },
];

export function CreateNewEngagement() {
  const history = useHistory();
  const { createEngagement } = useEngagements();
  const submitNewEngagement = async (
    customerName?: string,
    projectName?: string
  ) => {
    if (customerName && projectName) {
      await createEngagement({
        customer_name: customerName,
        project_name: projectName,
      });
      history.push(`/app/engagements/${customerName}/${projectName}`);
    } else {
      history.push('/app/engagements');
    }
  };

  const { formOptions } = useEngagements();
  const { currentEngagement, getEngagements, engagements } = useEngagements();
  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );
  const [customerName, setCustomerName] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [region, setRegion] = useState<string>();
  const { getValidationResult, validate } = useValidation();
  useEffect(() => {
    if (engagements.length === 0 && !hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      getEngagements();
    }
  }, [setHasFetchedEngagements, getEngagements]);
  useEffect(() => {
    setCustomerName(null);
    setProjectName(null);
  }, [currentEngagement]);

  const hasValidInput =
    !!customerName &&
    !!projectName &&
    getValidationResult('project_name')?.length === 0 &&
    getValidationResult('customer_name')?.length === 0;

  return (
    <div
      style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <ValidationProvider
        validators={getValidatorsFromFormOptions(formOptions)}
      >
        <PageSection variant={PageSectionVariants.light}>
          <Title headingLevel="h1">Create New Engagement</Title>
          <Text component="h6">
            To create a new Engagement, please enter a client and product name
            then click submit.
          </Text>
        </PageSection>
        <PageSection isFilled={true}>
          <Grid>
            <GridItem md={12} lg={6}>
              <Form>
                <FormGroup
                  label={
                    <SectionTitle>
                      Customer Name&nbsp;&nbsp;
                      <CheckCircleIcon
                        color={
                          getValidationResult('customer_name').length === 0 &&
                          !!customerName
                            ? 'green'
                            : 'lightgrey'
                        }
                      />
                    </SectionTitle>
                  }
                  fieldId="customer-name"
                  helperText="What client is this for?"
                  helperTextInvalid={getValidationResult('customer_name').join(
                    ' '
                  )}
                  validated={
                    getValidationResult('customer_name').length > 0
                      ? 'error'
                      : 'default'
                  }
                >
                  <CustomerSelectDropdown
                    placeholder="e.g. NASA"
                    selectedValue={customerName}
                    onSelect={value =>
                      validate('customer_name')(value) && setCustomerName(value)
                    }
                  />
                </FormGroup>
                <FormGroup
                  label={
                    <SectionTitle>
                      Project Name&nbsp;&nbsp;
                      <CheckCircleIcon
                        color={
                          getValidationResult('project_name').length === 0 &&
                          !!projectName
                            ? 'green'
                            : 'lightgrey'
                        }
                      />
                    </SectionTitle>
                  }
                  fieldId="project-name"
                  helperText="The name of the solution being worked on."
                  helperTextInvalid={getValidationResult('project_name').join(
                    ' '
                  )}
                  validated={
                    getValidationResult('project_name').length > 0
                      ? 'error'
                      : 'default'
                  }
                >
                  <TextInput
                    type="text"
                    id="project_name"
                    name="project_name"
                    placeholder="e.g. Mars Probe"
                    value={projectName || ''}
                    onChange={value =>
                      validate('project_name')(value) && setProjectName(value)
                    }
                    data-cy="new_engagement_name"
                  />
                </FormGroup>
                <FormGroup
                  label={
                    <SectionTitle>
                      Region&nbsp;&nbsp;
                      <CheckCircleIcon
                        color={
                          getValidationResult('region').length === 0 && !!region
                            ? 'green'
                            : 'lightgrey'
                        }
                      />
                    </SectionTitle>
                  }
                  fieldId="region"
                  helperText="In what region will this engagement take place?"
                  helperTextInvalid={getValidationResult('region').join(' ')}
                  validated={
                    getValidationResult('region').length > 0
                      ? 'error'
                      : 'default'
                  }
                >
                  <FormSelect
                    value={region}
                    onChange={e => {
                      setRegion(e);
                    }}
                  >
                    {[
                      <FormSelectOption
                        value={undefined}
                        label="Select Region"
                        key="undefined region"
                      />,
                    ].concat(
                      REGIONS.map(r => {
                        return (
                          <FormSelectOption
                            label={r.label}
                            key={r.value}
                            value={r.value}
                          ></FormSelectOption>
                        );
                      })
                    )}
                  </FormSelect>
                </FormGroup>
              </Form>
              <Button
                style={{ margin: '1rem 0' }}
                isDisabled={!hasValidInput}
                onClick={() => submitNewEngagement(customerName, projectName)}
              >
                Submit
              </Button>
            </GridItem>
          </Grid>
        </PageSection>
      </ValidationProvider>
    </div>
  );
}
