import React from 'react';
import { render } from 'enzyme';
import { ClusterUsers } from './04_cluster_users';
import { getInitialState } from '../../../context/engagement_context/engagement_form_reducer';

const defaultOptions = {
  'user-management': {
    rbac: {
      roles: [
        {
          first_name: 'Philip',
          last_name: 'Double',
          email: 'pdouble@redhat.com',
          role: 'admin',
        },
        {
          first_name: 'Hudson',
          last_name: 'Double',
          email: 'hdouble@redhat.com',
          role: 'observer',
        },
        {
          first_name: 'Isa',
          last_name: 'Double',
          email: 'idouble@redhat.com',
          role: 'developer',
        },
      ],
    },
  },
};

test('Basic component renders correctly', () => {
  const component = render(
    <ClusterUsers options={defaultOptions} values={getInitialState()} />
  );
  expect(component).toMatchSnapshot();
});
