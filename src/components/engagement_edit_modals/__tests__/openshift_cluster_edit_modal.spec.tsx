import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { OpenShiftClusterEditModal } from '../openshift_cluster_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <OpenShiftClusterEditModal
            onSave={() => {}}
            isOpen={true}
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            isEngagementLaunched={false}
            onClose={() => {}}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <TestStateWrapper>
        <OpenShiftClusterEditModal
          onSave={onSave}
          hostingEnvironment={Engagement.fromFake(true).hosting_environments[0]}
          isOpen={true}
          isEngagementLaunched={false}
          onClose={() => {}}
        />
      </TestStateWrapper>
    );
    await fireEvent.click(getByTestId('oc-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
