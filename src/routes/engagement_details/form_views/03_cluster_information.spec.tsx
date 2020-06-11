import React from 'react';
import { render } from 'enzyme';
import { ClusterInformation } from './03_cluster_information';
import { getInitialState } from '../../../context/engagement_context/engagement_form_reducer';
const options = {
  providers: [
    {
      label: 'AWS',
      value: 'ec2',
      regions: [
        {
          label: 'US East 1 (N. Virginia)',
          value: 'us-east-1',
        },
        {
          label: 'US East 2 (Ohio)',
          value: 'us-east-2',
        },
      ],
    },
  ],
  openshift: {
    versions: [
      {
        label: 'v4.1',
        value: 'v4.1',
      },
      {
        label: 'v4.2',
        value: 'v4.2',
      },
    ],
    'persistent-storage': [
      {
        label: 'None',
        value: 'none',
      },
      {
        label: '50GB',
        value: '50G',
      },
      {
        label: '100GB',
        value: '100G',
      },
      {
        label: '250GB',
        value: '250G',
      },
      {
        label: '500GB',
        value: '500G',
      },
    ],
    'cluster-size': [
      {
        label: 'Small',
        value: 'small',
      },
    ],
  },
};

test('Basic component renders correctly', () => {
  const component = render(
    <ClusterInformation
      formOptions={{}}
      onChange={() => {}}
      values={getInitialState()}
    />
  );
  expect(component).toMatchSnapshot();
});
