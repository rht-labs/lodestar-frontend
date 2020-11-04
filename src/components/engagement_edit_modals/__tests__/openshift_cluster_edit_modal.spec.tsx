import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { OpenShiftClusterEditModal } from '../openshift_cluster_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <OpenShiftClusterEditModal
          onSave={() => {}}
          engagementFormConfig={{}}
          isOpen={true}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <OpenShiftClusterEditModal
        onSave={onSave}
        hostingEnvironment={Engagement.fromFake(true).hosting_environments[0]}
        engagementFormConfig={({} as unknown) as EngagementFormConfig}
        isOpen={true}
        isEngagementLaunched={false}
        onClose={() => {}}
      />
    );
    await fireEvent.click(getByTestId('oc-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
