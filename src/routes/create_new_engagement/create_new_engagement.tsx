import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { getValidatorsFromEngagementFormConfig } from '../../common/config_validator_adapter';
import {
  PageSection,
  Title,
  PageSectionVariants,
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

export function CreateNewEngagement() {
  const { engagementFormConfig, getConfig } = useEngagements();
  const [hasFetchedConfig, setHasFetchedConfig] = useState<boolean>(false);
  useEffect(() => {
    if (!hasFetchedConfig && !engagementFormConfig) {
      getConfig();
      setHasFetchedConfig(true);
    }
  }, [hasFetchedConfig, engagementFormConfig, getConfig]);
  return (
    <ValidationProvider validators={getValidatorsFromEngagementFormConfig(engagementFormConfig)}>
      <CreateNewEngagementForm />
    </ValidationProvider>
  );
}
export function CreateNewEngagementForm() {
  const {
    createEngagement,
    engagementFormConfig,
    currentEngagement,
    getEngagements,
    engagements,
  } = useEngagements();
  const history = useHistory();
  const [customerName, setCustomerName] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [region, setRegion] = useState<string>();
  const [engagementType, setEngagementType] = useState<string>();
  const submitNewEngagement = async () => {
    if (customerName && projectName) {
      await createEngagement({
        customer_name: customerName,
        project_name: projectName,
        engagement_region: region,
        engagement_type:
          engagementType ??
          engagementFormConfig?.basic_information?.engagement_type?.options?.find?.(
            e => e.default
          )?.value,
      });
      history.push(`/app/engagements/${customerName}/${projectName}`);
    } else {
      history.push('/app/engagements');
    }
  };

  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );
  useEffect(() => {
    if (
      engagementType === undefined &&
      engagementFormConfig?.basic_information?.engagement_types
    ) {
      const defaultType = engagementFormConfig?.basic_information?.engagement_types?.options?.find?.(
        e => e.default
      )?.value;
      setEngagementType(defaultType ? defaultType : null);
    }
  }, [engagementFormConfig, engagementType]);
  const { getValidationResult, validate } = useValidation();
  useEffect(() => {
    if (engagements.length === 0 && !hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      getEngagements();
    }
  }, [
    setHasFetchedEngagements,
    getEngagements,
    engagements.length,
    hasFetchedEngagements,
  ]);
  useEffect(() => {
    setCustomerName(null);
    setProjectName(null);
    setRegion(null);
  }, [currentEngagement]);

  const hasValidInput =
    !!customerName &&
    !!projectName &&
    !!region &&
    getValidationResult('project_name')?.length === 0 &&
    getValidationResult('customer_name')?.length === 0 &&
    getValidationResult('engagement_region')?.length === 0;

  return (
    <div
      style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
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
                    Client Name&nbsp;&nbsp;
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
                helperTextInvalid={getValidationResult('customer_name').join(
                  ' '
                )}
                validated={
                  getValidationResult('customer_name').length > 0
                    ? 'error'
                    : 'default'
                }
              >
                <div data-testid="customer-name">
                  <CustomerSelectDropdown
                    placeholder="NASA"
                    selectedValue={customerName}
                    onSelect={value =>
                      validate('customer_name')(value) && setCustomerName(value)
                    }
                  />
                </div>
              </FormGroup>
              <FormGroup
                label={
                  <SectionTitle>
                    Engagement Name&nbsp;&nbsp;
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
                helperText="A descriptive name to idenitfy your engagement"
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
                  data-testid="project-name"
                  type="text"
                  id="project_name"
                  name="project_name"
                  placeholder="Mars Probe"
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
                        getValidationResult('engagement_region').length === 0 &&
                        !!region
                          ? 'green'
                          : 'lightgrey'
                      }
                    />
                  </SectionTitle>
                }
                fieldId="region"
                helperText="The region sponsoring the engagement"
                helperTextInvalid={getValidationResult(
                  'engagement_region'
                ).join(' ')}
                validated={
                  getValidationResult('engagement_region').length > 0
                    ? 'error'
                    : 'default'
                }
              >
                <FormSelect
                  data-testid="region"
                  data-cy="new_engagement_region"
                  value={region}
                  onChange={e => {
                    setRegion(e);
                  }}
                >
                  {[
                    <FormSelectOption
                      value={undefined}
                      label="Select a region"
                      key="undefined region"
                    />,
                  ].concat(
                    engagementFormConfig?.basic_information?.engagement_regions?.options?.map(
                      r => {
                        return (
                          <FormSelectOption
                            label={r.label}
                            key={r.value}
                            value={r.value}
                          ></FormSelectOption>
                        );
                      }
                    )
                  )}
                </FormSelect>
              </FormGroup>
              <FormGroup
                label={<SectionTitle>Type&nbsp;&nbsp;</SectionTitle>}
                fieldId="region"
                helperTextInvalid={getValidationResult('engagement_type').join(
                  ' '
                )}
                validated={
                  getValidationResult('engagement_type').length > 0
                    ? 'error'
                    : 'default'
                }
              >
                <FormSelect
                  data-testid="new-engagement-type"
                  data-cy="new_engagement_type"
                  value={engagementType}
                  onChange={e => {
                    setEngagementType(e);
                  }}
                >
                  {engagementFormConfig?.basic_information?.engagement_types?.options?.map(
                    r => {
                      return (
                        <FormSelectOption
                          label={r.label}
                          key={r.value}
                          value={r.value}
                        ></FormSelectOption>
                      );
                    }
                  )}
                </FormSelect>
              </FormGroup>
            </Form>
            <Button
              data-testid="create-engagement-button"
              data-cy="createNewEngagement"
              style={{ margin: '1rem 0' }}
              isDisabled={!hasValidInput}
              onClick={submitNewEngagement}
            >
              Submit
            </Button>
          </GridItem>
        </Grid>
      </PageSection>
    </div>
  );
}
