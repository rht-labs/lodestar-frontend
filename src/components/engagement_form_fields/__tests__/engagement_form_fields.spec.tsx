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
import { EngagementFormConfig } from '../../../schemas/engagement_config';
describe('Engagement form fields', () => {
  test('Additional details form matches snapshot', () => {
    expect(
      render(
        <AdditionalDetailsFormField
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Additional details form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <AdditionalDetailsFormField
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('additional-details-text-area');
    await fireEvent.change(textArea, { target: { value: 'bot' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Cloud provider form matches snapshot', () => {
    expect(
      render(
        <CloudProviderFormField
          availableProviders={[{ label: 'AWS', value: 'ec2' }]}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Cloud provider form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <CloudProviderFormField
        availableProviders={[{ label: 'AWS', value: 'ec2' }]}
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('cloud-provider-select');
    await fireEvent.change(textArea, { target: { value: 'bot' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Cloud provider region form matches snapshot', () => {
    expect(
      render(
        <CloudProviderRegionFormField
          availableProviderRegionOptions={[
            { label: 'N. Virginia', value: 'nva' },
          ]}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Cloud provider region form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <CloudProviderRegionFormField
        availableProviderRegionOptions={[
          { label: 'N. Virginia', value: 'nva' },
        ]}
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('provider-region-select');
    await fireEvent.change(textArea, { target: { value: 'nva' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Cluster size form matches snapshot', () => {
    expect(
      render(
        <ClusterSizeFormField
          engagementFormConfig={EngagementFormConfig.fromFake()}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Cloud provider form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <ClusterSizeFormField
        engagementFormConfig={EngagementFormConfig.fromFake()}
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
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
        <OpenShiftVersionFormField
          engagementFormConfig={EngagementFormConfig.fromFake()}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('OpenShift Version form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <OpenShiftVersionFormField
        engagementFormConfig={EngagementFormConfig.fromFake()}
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('oc-version-select');
    await fireEvent.change(textArea, { target: { value: '4.1.41' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Persistent storage form matches snapshot', () => {
    expect(
      render(
        <PersistentStorageFormField
          engagementFormConfig={EngagementFormConfig.fromFake()}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Persistent Storage form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <PersistentStorageFormField
        engagementFormConfig={EngagementFormConfig.fromFake()}
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('persistent-storage-select');
    await fireEvent.change(textArea, { target: { value: '50G' } });
    expect(onChange).toHaveBeenCalled();
  });
  test('Subdomain form matches snapshot', () => {
    expect(
      render(
        <SubdomainFormField
          engagementFormConfig={EngagementFormConfig.fromFake()}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Subdomain form fires onChange', async () => {
    const onChange = jest.fn();
    const wrapper = render(
      <SubdomainFormField
        engagementFormConfig={EngagementFormConfig.fromFake()}
        engagement={Engagement.fromFake(true)}
        onChange={onChange}
      />
    );
    const textArea = await wrapper.findByTestId('subdomain-input');
    await fireEvent.change(textArea, {
      target: { value: 'example-subdomain' },
    });
    expect(onChange).toHaveBeenCalled();
  });
});
