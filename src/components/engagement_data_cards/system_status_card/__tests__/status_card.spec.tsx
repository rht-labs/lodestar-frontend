import React from 'react';
import {
  render,
  fireEvent,
  waitForDomChange,
  act,
} from '@testing-library/react';
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
import { ModalVisibilityContext } from '../../../../context/edit_modal_visibility_context/edit_modal_visibility_context';

describe('System Status Card', () => {
  test('Card matches snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <TestStateWrapper>
          <SystemStatusCard
            currentEngagement={Engagement.fromFake(true, {
              status: EngagementStatus.active,
              uniqueSuffix: '0',
            })}
          />
        </TestStateWrapper>
      );
      await waitForDomChange;
      expect(rendered).toMatchSnapshot();
    });
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

  test('Clicking a subsystem requests a modal to open', async () => {
    const onRequestOpen = jest.fn();
    const wrapper = render(
      <ModalVisibilityContext.Provider
        value={{
          requestOpen: onRequestOpen,
          activeModalKey: '',
          requestClose: () => {},
        }}
      >
        <SystemStatusCard
          currentEngagement={Engagement.fromFake(true, {
            status: EngagementStatus.active,
          })}
        />
      </ModalVisibilityContext.Provider>
    );
    fireEvent.click(wrapper.getAllByTestId('subsystem-item')[0]);
    expect(onRequestOpen).toHaveBeenCalled();
  });
});
