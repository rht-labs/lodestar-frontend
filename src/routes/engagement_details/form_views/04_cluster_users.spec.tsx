import React from 'react';
import { render } from 'enzyme';
import { ClusterUsers } from './04_cluster_users';
import { getInitialState } from '../../../context/engagement_context/engagement_form_reducer';

test('Basic component renders correctly', () => {
  const component = render(
    <ClusterUsers
      onChange={() => {}}
      formOptions={{}}
      engagement={getInitialState()}
    />
  );
  expect(component).toMatchSnapshot();
});
