import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { OpenShiftClusterEditModal } from '../openshift_cluster_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Hosting Environment edit modal', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <TestStateWrapper>
          <OpenShiftClusterEditModal
            onSave={() => {}}
            isOpen={true}
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            isEngagementLaunched={false}
            onClose={() => {}}
          />
        </TestStateWrapper>
      );

      expect(rendered).toMatchSnapshot();
    });
  });

  test('When clicking the save button, the onSave method is called', async () => {
    await act(async () => {
      const onSave = jest.fn();
      const { findByTestId } = render(
        <TestStateWrapper>
          <OpenShiftClusterEditModal
            onSave={onSave}
            hostingEnvironment={
              Engagement.fromFake(true).hosting_environments[0]
            }
            isOpen={true}
            isEngagementLaunched={false}
            onClose={() => {}}
          />
        </TestStateWrapper>
      );
      await fireEvent.click(await findByTestId('oc-edit-save'));
      expect(onSave).toHaveBeenCalled();
    });
  });
});
