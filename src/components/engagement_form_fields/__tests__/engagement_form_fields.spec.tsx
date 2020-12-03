import React from 'react';
import { AdditionalDetailsFormField } from '../additional_details';
import { Engagement } from '../../../schemas/engagement';
import { CloudProviderFormField } from '../cloud_provider';
import { CloudProviderRegionFormField } from '../cloud_provider_region';
import { ClusterSizeFormField } from '../cluster_size';
import { LocationFormField } from '../location';
import { OpenShiftVersionFormField } from '../oc_version';
import { PersistentStorageFormField } from '../persistent_storage';
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
  test('Cloud provider region form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <CloudProviderRegionFormField
            isEngagementLaunched={false}
            availableProviderRegionOptions={[
              { label: 'N. Virginia', value: 'nva' },
            ]}
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            onChange={() => {}}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Cloud provider region form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <CloudProviderRegionFormField
          availableProviderRegionOptions={[
            { label: 'N. Virginia', value: 'nva' },
          ]}
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          onChange={onChange}
          isEngagementLaunched={true}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('provider-region-select');
    await fireEvent.change(textArea, { target: { value: 'nva' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Cluster size form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <ClusterSizeFormField
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            onChange={() => {}}
            isEngagementLaunched={true}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Cloud provider form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <ClusterSizeFormField
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          isEngagementLaunched={true}
          onChange={onChange}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('cluster-size-select');
    await fireEvent.change(textArea, { target: { value: '1' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Location form matches snapshot', () => {
    expect(
      render(
        <LocationFormField
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Location form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <LocationFormField
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('location-field');
    await fireEvent.change(textArea, { target: { value: 'nva' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('OpenShift Version form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <OpenShiftVersionFormField
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            isEngagementLaunched={true}
            onChange={() => {}}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('OpenShift Version form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <OpenShiftVersionFormField
          isEngagementLaunched={true}
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          onChange={onChange}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('oc-version-select');
    await fireEvent.change(textArea, { target: { value: '4.1.41' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Persistent storage form matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <PersistentStorageFormField
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            isEngagementLaunched={true}
            onChange={() => {}}
          />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
  test('Persistent Storage form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <TestStateWrapper>
        <PersistentStorageFormField
          hostingEnvironment={HostingEnvironment.fromFake(true)}
          isEngagementLaunched={true}
          onChange={onChange}
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('persistent-storage-select');
    await fireEvent.change(textArea, { target: { value: '50G' } });
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
        />
      </TestStateWrapper>
    );
    const textArea = await wrapper.findByTestId('subdomain-input');
    await fireEvent.change(textArea, {
      target: { value: 'example-subdomain' },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
