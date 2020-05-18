import { Engagement } from './engagement_schema';

describe('Engagement Schema', () => {
  test('Faked engagement schema has not changed', () => {
    expect({ ...Engagement.fromFake() }).toEqual({
      archive_date: 'faker',
      customer_contact_email: 'faker',
      customer_contact_name: 'faker',
      customer_name: 'faker',
      description: 'faker',
      end_date: 'faker',
      engagement_users: [],
      engagement_lead_email: 'faker',
      engagement_lead_name: 'faker',
      location: 'faker',
      ocp_cloud_provider_name: 'faker',
      ocp_cloud_provider_region: 'faker',
      ocp_cluster_size: 'faker',
      ocp_persistent_storage_size: 'faker',
      ocp_sub_domain: 'faker',
      ocp_version: 'faker',
      project_id: 1,
      project_name: 'faker',
      start_date: 'faker',
      technical_lead_email: 'faker',
      technical_lead_name: 'faker',
      launch: {},
    });
  });
  test('users should be an empty array by default', () => {
    expect(new Engagement({} as Engagement).engagement_users).toEqual([]);
  });
});
