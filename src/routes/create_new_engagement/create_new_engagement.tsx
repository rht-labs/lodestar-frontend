import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { getValidatorsFromEngagementFormConfig } from '../../common/config_validator_adapter';
import { AnalyticsCategory } from '../../schemas/analytics';
import {
  PageSection,
  Title,
  PageSectionVariants,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  FormSelectOptionGroup,
} from '@patternfly/react-core';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  Text,
} from '@patternfly/react-core';
import { useAnalytics } from '../../context/analytics_context/analytics_context';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { CustomerSelectDropdown } from '../../components/customer_select_dropdown/customer_select_dropdown';
import { useValidation } from '../../context/validation_context/validation_hook';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { SectionTitle } from '../../components/section_title/section_title';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../../components/feature/feature';
import { Engagement } from '../../schemas/engagement';

export function CreateNewEngagement() {
  const { engagementFormConfig } = useEngagements();
  return (
    <ValidationProvider
      validators={getValidatorsFromEngagementFormConfig(engagementFormConfig)}
    >
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
  const [selectedProjectNameToFind, setSelectedProjectNameToFind] = useState<
    string
  >();
  const [copiedEngagement, setCopiedEngagement] = useState<Engagement>();
  const { logEvent } = useAnalytics();

  useEffect(() => {
    setCopiedEngagement(
      findEngagementToCopy(engagements, selectedProjectNameToFind)
    );
  }, [selectedProjectNameToFind, engagements]);

  const submitNewEngagement = async () => {
    if (customerName && projectName) {
      if (selectedProjectNameToFind) {
        await createEngagement({
          customer_name: customerName,
          project_name: projectName,
          engagement_region: region,
          engagement_type:
            engagementType ??
            engagementFormConfig?.basic_information?.engagement_type?.options?.find?.(
              e => e.default
            )?.value,
          engagement_categories: copiedEngagement?.engagement_categories,
          ocp_cloud_provider_name: copiedEngagement?.ocp_cloud_provider_name,
          ocp_cloud_provider_region:
            copiedEngagement?.ocp_cloud_provider_region,
          ocp_cluster_size: copiedEngagement?.ocp_cluster_size,
          ocp_persistent_storage_size:
            copiedEngagement?.ocp_persistent_storage_size,
          ocp_version: copiedEngagement?.ocp_version,
        });
      } else {
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
      }

      logEvent({
        action: 'Create New Engagement',
        category: AnalyticsCategory.engagements,
      });
      history.push({
        pathname: `/app/engagements/${customerName}/${projectName}`,
      });
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

  function findEngagementToCopy(
    engagements: Engagement[],
    selectedProjectNameToFind?: string
  ) {
    return engagements?.find(
      engagement =>
        engagement?.project_name?.toLowerCase().trim() ===
        selectedProjectNameToFind?.trim()?.toLowerCase()
    );
  }

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
                          />
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
                        />
                      );
                    }
                  )}
                </FormSelect>
              </FormGroup>
              <FormGroup
                label={<SectionTitle>Copy From&nbsp;&nbsp;</SectionTitle>}
                fieldId="copyFrom"
                helperText="Prepopulate details of this engagement based on a selected template or an existing engagement"
              >
                <FormSelect
                  data-testid="new-engagement-copy-from"
                  data-cy="new-engagement-copy-from"
                  value={selectedProjectNameToFind}
                  onChange={e => {
                    setSelectedProjectNameToFind(e);
                  }}
                >
                  <FormSelectOption
                    value={undefined}
                    label="None"
                    key="undefined engagement"
                  />
                  <FormSelectOptionGroup label={'Templates'}>
                    {
                      <FormSelectOption
                        isDisabled={true}
                        value={undefined}
                        label="No templates available"
                        key="undefined template"
                      />
                    }
                  </FormSelectOptionGroup>
                  <FormSelectOptionGroup label={'Existing engagements'}>
                    {engagements
                      ?.sort(function(a, b) {
                        if (
                          a.customer_name.toUpperCase() <
                          b.customer_name.toUpperCase()
                        ) {
                          return -1;
                        }
                        if (
                          a.customer_name.toUpperCase() >
                          b.customer_name.toUpperCase()
                        ) {
                          return 1;
                        }
                        return 0;
                      })
                      .map(engagement => {
                        return (
                          <FormSelectOption
                            label={
                              engagement.customer_name +
                              ' - ' +
                              engagement.project_name
                            }
                            key={
                              engagement.project_name + engagement.customer_name
                            }
                            value={engagement.project_name}
                          />
                        );
                      })}
                  </FormSelectOptionGroup>
                </FormSelect>
              </FormGroup>
            </Form>
            <Feature name={APP_FEATURES.writer}>
              <Button
                data-testid="create-engagement-button"
                data-cy="createNewEngagement"
                style={{ margin: '1rem 0' }}
                isDisabled={!hasValidInput}
                onClick={submitNewEngagement}
              >
                Submit
              </Button>
            </Feature>
          </GridItem>
        </Grid>
      </PageSection>
    </div>
  );
}
