import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Feature } from '../feature';
import { APP_FEATURES } from '../../common/app_features';
import { Button, ButtonVariant, Flex, FlexItem } from '@patternfly/react-core';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

export interface EditPaneWrapperProps {
  children: any;
  engagement?: Engagement;
}

export function EditPaneWrapper(props: EditPaneWrapperProps) {
  const { engagement } = props;
  const { saveEngagement } = useEngagements();
  if (engagement) {
    return (
      <Feature name={APP_FEATURES.writer}>
        <div style={{ padding: '0 3rem 0 3rem' }}>
          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
            <FlexItem>
              <Button
                onClick={() => saveEngagement(engagement)}
                variant={ButtonVariant.secondary}
              >
                Save
              </Button>
            </FlexItem>
          </Flex>
        </div>
        {props.children}
      </Feature>
    );
  }
  return <div></div>;
}
