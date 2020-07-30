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
import { render } from '@testing-library/react';
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
  test('Cluster size form matches snapshot', () => {
    expect(
      render(
        <ClusterSizeFormField
          formOptions={{}}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
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
  test('OpenShift form matches snapshot', () => {
    expect(
      render(
        <OpenShiftVersionFormField
          formOptions={{}}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Persistent storage form matches snapshot', () => {
    expect(
      render(
        <PersistentStorageFormField
          formOptions={{}}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
  test('Subdomain form matches snapshot', () => {
    expect(
      render(
        <SubdomainFormField
          formOptions={{}}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });
});
