import React from 'react';
import { AdditionalDetailsFormField } from '../additional_details';
import { CloudProviderFormField } from '../cloud_provider';
import { SubdomainFormField } from '../subdomain';
import { render, fireEvent } from '@testing-library/react';
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
describe('Engagement form fields', () => {
  test('Additional details form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <AdditionalDetailsFormField
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            onChange={() => {}}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Additional details form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <AdditionalDetailsFormField
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          onChange={onChange}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('additional-details-text-area');
    await fireEvent.change(textArea, { target: { value: 'bot' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Cloud provider form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <CloudProviderFormField
            availableProviders={[{ label: 'AWS', value: 'ec2' }]}
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            onChange={() => {}}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Cloud provider form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <CloudProviderFormField
          availableProviders={[{ label: 'AWS', value: 'ec2' }]}
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          onChange={onChange}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('cloud-provider-select');
    await fireEvent.change(textArea, { target: { value: 'bot' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Subdomain form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <SubdomainFormField
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            isEngagementLaunched={true}
            onChange={() => {}}
            suggestedSubdomain={''}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Subdomain form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <SubdomainFormField
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          isEngagementLaunched={true}
          onChange={onChange}
          suggestedSubdomain={''}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('desired_subdomain_input');
    await fireEvent.change(textArea, {
      target: { value: 'example-subdomain' },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
