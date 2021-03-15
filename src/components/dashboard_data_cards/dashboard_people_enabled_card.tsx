import React, {useState} from 'react';
import {
  Card,
  CardBody, CardTitle,
  Text,
  TextContent,
  TextVariants, Flex, FlexItem, Dropdown, DropdownToggle, FormSelectOption, FormSelect
} from '@patternfly/react-core';
import { CaretDownIcon, RedhatIcon, UserIcon} from "@patternfly/react-icons";
import {SectionTitle} from "../section_title/section_title";
import {useEngagements} from "../../context/engagement_context/engagement_hook";

export interface DashboardPeopleEnabledCardProps {
}

export function DashboardPeopleEnabledCard({
}: DashboardPeopleEnabledCardProps) {

  const [region, setRegion] = useState<string>();
  const { engagementFormConfig } = useEngagements();

  const miniCardShape: React.CSSProperties = {
    minHeight: '20vh',
    minWidth: '52vh',
  };

  return (
    <>
      <Card isHoverable style={miniCardShape}>
        <CardTitle>
          <TextContent>
            <Flex>
              <FlexItem>
                <Text component={TextVariants.h1} style={{color: '#A7D54B'}}>
                  38
                </Text>
              </FlexItem>
              <FlexItem>
                <Text component={TextVariants.h2}>
                  People Enabled in
                </Text>
              </FlexItem>
              <FlexItem>
                  <FormSelect
                    style={{minWidth:'10rem'}}
                    value={region ?? ''}
                    onChange={e => {
                      setRegion(e);
                    }}
                  >
                    {[
                      <FormSelectOption
                        value={'all'}
                        label="All regions"
                        key="all"
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
              </FlexItem>
            </Flex>
          </TextContent>
        </CardTitle>
        <CardBody>
          <RedhatIcon style={{ fontSize: '1.3rem', marginRight: '0.5rem'}} />
          28 Red Hatters
        </CardBody>
        <CardBody>
          <UserIcon style={{ fontSize: '1.3rem', marginRight: '0.5rem'}}/>
          10 Non-Red Hatters
        </CardBody>
      </Card>
    </>
  )
};
