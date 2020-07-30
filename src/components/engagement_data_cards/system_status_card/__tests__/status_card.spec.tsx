import React from 'react';
import { render } from '@testing-library/react';
import { SystemStatusCard } from '../system_status_card';
import { TestStateWrapper } from '../../../../common/test_state_wrapper';
import { Engagement, EngagementStatus } from '../../../../schemas/engagement';
import { StatusMessageItem } from '../status_message_item';
import { Severity } from '../../../../schemas/system_message';
import { SubsystemDetailsModal } from '../subsystem_details_modal';
import { Subsystem } from '../../../../schemas/subsystem';
import { SubsystemDetails } from '../subsystem_details';
import { SystemStatusDetailsModal } from '../system_status_details_modal';
import { StatusIcon } from '../status_icons';
import { HealthStatus } from '../../../../schemas/cluster_status';

describe('System Status Card', () => {
  test('Card matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <SystemStatusCard
            currentEngagement={Engagement.fromFake(true, {
              status: EngagementStatus.active,
            })}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Message item matches snapshot', () => {
    expect(
      render(
        <StatusMessageItem
          message={'Hello, world!'}
          severity={Severity.danger}
          updated={new Date(2020, 1, 1)}
        />
      )
    );
  });
  test('Details modal matches snapshot', () => {
    expect(
      render(
        <SubsystemDetailsModal
          isOpen={true}
          subsystem={Subsystem.fromFake(true)}
        />
      )
    ).toMatchSnapshot();
  });

  test('Subsystem details matches snapshot', () => {
    expect(
      render(<SubsystemDetails subsystem={Subsystem.fromFake(true)} />)
    ).toMatchSnapshot();
  });

  test('System status details modal matches snapshot', () => {
    expect(
      render(
        <SystemStatusDetailsModal
          isOpen={true}
          engagement={Engagement.fromFake(true)}
        />
      )
    ).toMatchSnapshot();
  });

  test('Status icons match snapshot', () => {
    expect(
      render(<StatusIcon status={HealthStatus.green} />)
    ).toMatchSnapshot();
    expect(
      render(<StatusIcon status={HealthStatus.yellow} />)
    ).toMatchSnapshot();
    expect(render(<StatusIcon status={HealthStatus.red} />)).toMatchSnapshot();
  });
});
