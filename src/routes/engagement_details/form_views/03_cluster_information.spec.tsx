import React from 'react';
import { render } from 'enzyme';
import { ClusterInformation } from './03_cluster_information';
import { getInitialState } from '../../../context/engagement_context/engagement_form_reducer';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

test('Basic component renders correctly', () => {
  const component = render(
    <TestStateWrapper>
      <ClusterInformation
        formOptions={{}}
        onChange={() => {}}
        values={getInitialState()}
      />
    </TestStateWrapper>
  );
  expect(component).toMatchSnapshot();
});
